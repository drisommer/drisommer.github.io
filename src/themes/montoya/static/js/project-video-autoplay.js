// Smart Video Loading with First Video Priority and Viewport Detection
window.ProjectVideoAutoplay = function() {
  // Debug logging configuration
  // Can be toggled in browser console: window.VideoDebug = true/false
  // Or set in hugo.toml: params.performance.debugVideoLoading
  if (typeof window.VideoDebug === 'undefined') {
    const firstContainer = document.querySelector('.hero-video-wrapper');
    window.VideoDebug = firstContainer?.getAttribute('data-debug-video') === 'true' || false;
  }

  // Helper: Debug log (only if debugging enabled)
  function debugLog(...args) {
    if (window.VideoDebug) {
      console.log(...args);
    }
  }

  // Helper: Debug warn (only if debugging enabled)
  function debugWarn(...args) {
    if (window.VideoDebug) {
      console.warn(...args);
    }
  }

  // Loading queue to prevent connection pool exhaustion
  let loadingQueue = [];
  let currentlyLoading = 0;
  const MAX_CONCURRENT_LOADS = 2;

  // GSAP polling with maximum attempts
  let gsapCheckAttempts = 0;
  const MAX_GSAP_ATTEMPTS = 10;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initSmartVideoLoading();
  } else {
    checkGSAP();
  }

  function checkGSAP() {
    gsapCheckAttempts++;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initSmartVideoLoading();
    } else if (gsapCheckAttempts < MAX_GSAP_ATTEMPTS) {
      setTimeout(checkGSAP, 1000);
    } else {
      console.error('GSAP/ScrollTrigger failed to load after ' + MAX_GSAP_ATTEMPTS + ' attempts. Videos may not function correctly.');
    }
  }

  function initSmartVideoLoading() {
    // Register ScrollTrigger plugin
    if (gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Step 1: Read configuration from first video container
    const firstContainer = document.querySelector('.hero-video-wrapper');
    const lockMobileOrientation = firstContainer?.getAttribute('data-lock-mobile-orientation') === 'true';
    const mobileMaxWidth = parseInt(firstContainer?.getAttribute('data-mobile-max-width') || '768', 10);

    // Step 2: Handle first video (immediate load with correct orientation)
    handleFirstVideo();

    // Step 3: Set up lazy loading for all other videos
    setupLazyVideoLoading(lockMobileOrientation, mobileMaxWidth);

    // Step 4: Listen for orientation changes (mobile rotation)
    window.addEventListener('resize', debounce(() => {
      handleOrientationChange(lockMobileOrientation, mobileMaxWidth);
    }, 300));
  }

  // Helper: Get project name from container
  function getProjectName(container) {
    const projectItem = container.closest('.overlapping-image-inner');
    const titleElement = projectItem?.querySelector('.slide-title');
    return titleElement?.textContent.trim() || 'Unknown Project';
  }

  // Helper: Get which video is actually visible according to CSS
  function getVisibleVideo(container) {
    const landscapeVideo = container.querySelector('.bgvid--landscape');
    const portraitVideo = container.querySelector('.bgvid--portrait');
    const singleVideo = container.querySelector('.bgvid:not(.bgvid--landscape):not(.bgvid--portrait)');

    const projectName = getProjectName(container);

    // DEBUG: Log what we found
    debugLog(`[${projectName}] DOM check - Landscape: ${!!landscapeVideo}, Portrait: ${!!portraitVideo}, Single: ${!!singleVideo}`);
    if (landscapeVideo) debugLog(`[${projectName}]   - Landscape classes:`, landscapeVideo.className);
    if (portraitVideo) debugLog(`[${projectName}]   - Portrait classes:`, portraitVideo.className);
    if (singleVideo) debugLog(`[${projectName}]   - Single classes:`, singleVideo.className);

    // If single video (no orientation variants), return it
    if (singleVideo) {
      debugLog(`[${projectName}] ✅ Returning single video (no orientation variant)`);
      return singleVideo;
    }

    // Check which video is visible according to CSS
    if (landscapeVideo && portraitVideo) {
      const landscapeDisplay = window.getComputedStyle(landscapeVideo).display;
      const portraitDisplay = window.getComputedStyle(portraitVideo).display;

      debugLog(`[${projectName}] CSS visibility - Landscape: ${landscapeDisplay}, Portrait: ${portraitDisplay}`);

      // Return whichever is not hidden
      if (landscapeDisplay !== 'none') {
        debugLog(`[${projectName}] ✅ Loading LANDSCAPE video`);
        return landscapeVideo;
      } else if (portraitDisplay !== 'none') {
        debugLog(`[${projectName}] ✅ Loading PORTRAIT video`);
        return portraitVideo;
      }
    } else if (landscapeVideo) {
      // Only landscape exists, check if it's visible
      const landscapeDisplay = window.getComputedStyle(landscapeVideo).display;
      debugLog(`[${projectName}] Only landscape video exists, CSS display: ${landscapeDisplay}`);
      if (landscapeDisplay !== 'none') {
        debugLog(`[${projectName}] ✅ Loading LANDSCAPE video`);
        return landscapeVideo;
      }
      // If hidden by CSS, return null (can't show this video)
      debugWarn(`[${projectName}] ⚠️ Landscape video hidden by CSS (landscape-only on portrait viewport)`);
      return null;
    } else if (portraitVideo) {
      // Only portrait exists, check if it's visible
      const portraitDisplay = window.getComputedStyle(portraitVideo).display;
      debugLog(`[${projectName}] Only portrait video exists, CSS display: ${portraitDisplay}`);
      if (portraitDisplay !== 'none') {
        debugLog(`[${projectName}] ✅ Loading PORTRAIT video`);
        return portraitVideo;
      }
      // If hidden by CSS, return null
      debugWarn(`[${projectName}] ⚠️ Portrait video hidden by CSS`);
      return null;
    }

    debugWarn(`[${projectName}] ⚠️ No video found in container`);
    return null;
  }

  // Handle first video - load immediately
  function handleFirstVideo() {
    const firstVideoContainer = document.querySelector('[data-autoload="true"]')?.closest('.hero-video-wrapper');

    if (!firstVideoContainer) {
      debugWarn('⚠️ No first video container found (data-autoload="true")');
      return;
    }

    const projectName = getProjectName(firstVideoContainer);
    debugLog(`\n🎬 [${projectName}] FIRST VIDEO - Loading immediately on page load`);

    const landscapeVideo = firstVideoContainer.querySelector('.bgvid--landscape');
    const portraitVideo = firstVideoContainer.querySelector('.bgvid--portrait');

    if (landscapeVideo && portraitVideo) {
      // Has both orientations - determine which is visible and preserve the other
      const visibleVideo = getVisibleVideo(firstVideoContainer);
      const hiddenVideo = visibleVideo === landscapeVideo ? portraitVideo : landscapeVideo;

      if (hiddenVideo) {
        // FIX: Preserve source URL BEFORE removing attribute
        const hiddenSources = hiddenVideo.querySelectorAll('source');
        hiddenSources.forEach(source => {
          // Read src and data-src before any modifications
          const srcValue = source.getAttribute('src');
          const dataSrcValue = source.getAttribute('data-src');

          // Preserve whichever exists
          const urlToPreserve = srcValue || dataSrcValue;

          if (urlToPreserve) {
            source.removeAttribute('src');
            source.setAttribute('data-src', urlToPreserve);
          }
        });
      }

      // Load and play the visible video
      if (visibleVideo) {
        debugLog(`📥 [${projectName}] Loading first video immediately`);
        visibleVideo.load();
        visibleVideo.play().then(() => {
          debugLog(`✅ [${projectName}] First video PLAYING`);
        }).catch(err => {
          debugWarn(`⚠️ [${projectName}] First video autoplay prevented:`, err.message);
        });

        // Add error handling
        visibleVideo.addEventListener('error', function(e) {
          console.error(`❌ [${projectName}] First video failed to load:`, visibleVideo.currentSrc, e);
        });
      }
    } else {
      // Single orientation - get the visible video
      const visibleVideo = getVisibleVideo(firstVideoContainer);

      if (visibleVideo) {
        debugLog(`📥 [${projectName}] Loading first video immediately`);
        visibleVideo.load();
        visibleVideo.play().then(() => {
          debugLog(`✅ [${projectName}] First video PLAYING`);
        }).catch(err => {
          debugWarn(`⚠️ [${projectName}] First video autoplay prevented:`, err.message);
        });

        // Add error handling
        visibleVideo.addEventListener('error', function(e) {
          console.error(`❌ [${projectName}] First video failed to load:`, visibleVideo.currentSrc, e);
        });
      } else {
        debugWarn(`⚠️ [${projectName}] First video container found but no visible video (might be hidden by CSS on this viewport)`);
      }
    }
  }

  // Set up Intersection Observer for lazy loading
  function setupLazyVideoLoading(lockMobileOrientation, mobileMaxWidth) {
    // FIX: Only observe one video per container to prevent dual triggering
    const lazyContainers = [];
    const allLazyVideos = document.querySelectorAll('.lazy-video[data-lazy="true"]');

    // Group videos by container and only observe one per container
    const observedContainers = new Set();

    allLazyVideos.forEach(video => {
      const container = video.closest('.hero-video-wrapper');
      if (container && !observedContainers.has(container)) {
        observedContainers.add(container);

        // FIX: Observe whichever video is VISIBLE according to CSS
        // Don't observe hidden videos - IntersectionObserver won't fire for display:none elements!
        const landscapeVideo = container.querySelector('.bgvid--landscape.lazy-video');
        const portraitVideo = container.querySelector('.bgvid--portrait.lazy-video');
        const singleVideo = container.querySelector('.lazy-video:not(.bgvid--landscape):not(.bgvid--portrait)');

        let videoToObserve = null;

        if (singleVideo) {
          // Single video, always visible
          videoToObserve = singleVideo;
        } else if (landscapeVideo && portraitVideo) {
          // Both exist - check which one CSS is showing
          const landscapeDisplay = window.getComputedStyle(landscapeVideo).display;
          const portraitDisplay = window.getComputedStyle(portraitVideo).display;

          if (landscapeDisplay !== 'none') {
            videoToObserve = landscapeVideo;
          } else if (portraitDisplay !== 'none') {
            videoToObserve = portraitVideo;
          }
        } else if (landscapeVideo) {
          const landscapeDisplay = window.getComputedStyle(landscapeVideo).display;
          if (landscapeDisplay !== 'none') {
            videoToObserve = landscapeVideo;
          }
        } else if (portraitVideo) {
          const portraitDisplay = window.getComputedStyle(portraitVideo).display;
          if (portraitDisplay !== 'none') {
            videoToObserve = portraitVideo;
          }
        }

        if (videoToObserve) {
          const projectName = getProjectName(container);
          debugLog(`📌 [${projectName}] Set up observer on ${videoToObserve.className.includes('landscape') ? 'LANDSCAPE' : videoToObserve.className.includes('portrait') ? 'PORTRAIT' : 'SINGLE'} video`);
          lazyContainers.push({ container: container, video: videoToObserve });
        } else {
          const projectName = getProjectName(container);
          debugWarn(`⚠️ [${projectName}] No visible video found for observation (all videos hidden by CSS?)`);
        }
      }
    });

    if (lazyContainers.length === 0) {
      debugWarn('⚠️ No lazy video containers found to observe');
      return;
    }

    debugLog(`📊 Total containers to observe: ${lazyContainers.length}`);

    // Create Intersection Observer with larger margin to reduce simultaneous loads
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const triggerVideo = entry.target;
          const container = triggerVideo.closest('.hero-video-wrapper');
          const projectName = getProjectName(container);

          debugLog(`\n🔍 [${projectName}] ENTERED VIEWPORT - Triggering lazy load`);

          // Use loading queue to prevent connection pool exhaustion
          loadVideoWithQueue(container);
          observer.unobserve(triggerVideo); // Stop observing once queued
        }
      });
    }, {
      rootMargin: '200px' // Increased from 50px to reduce simultaneous loads
    });

    // Observe the selected videos
    lazyContainers.forEach(item => {
      videoObserver.observe(item.video);
    });
  }

  // Queue video loading to prevent connection pool exhaustion
  function loadVideoWithQueue(container) {
    const projectName = getProjectName(container);

    if (currentlyLoading < MAX_CONCURRENT_LOADS) {
      debugLog(`📥 [${projectName}] Loading immediately (${currentlyLoading}/${MAX_CONCURRENT_LOADS} slots used)`);
      loadVideoImmediately(container);
    } else {
      debugLog(`⏳ [${projectName}] QUEUED (${currentlyLoading}/${MAX_CONCURRENT_LOADS} slots full, queue length: ${loadingQueue.length})`);
      loadingQueue.push({ container: container });
    }
  }

  // Load video immediately and track loading state
  function loadVideoImmediately(container) {
    const projectName = getProjectName(container);
    currentlyLoading++;

    debugLog(`🎬 [${projectName}] Starting video load (currentlyLoading: ${currentlyLoading})`);

    // FIX: Get the actual video that is visible according to CSS
    const actualVideo = loadVideoForContainer(container);

    // Add event listeners to the CORRECT video
    if (actualVideo) {
      actualVideo.addEventListener('loadeddata', function() {
        debugLog(`✅ [${projectName}] Video loaded successfully`);
        onVideoLoadComplete();
      }, { once: true });

      actualVideo.addEventListener('error', function(e) {
        console.error(`❌ [${projectName}] Video load ERROR:`, e);
        onVideoLoadComplete();
      }, { once: true });
    } else {
      // No visible video, decrement immediately
      debugWarn(`⚠️ [${projectName}] Container has no visible video, skipping load`);
      currentlyLoading--;
      processQueue();
    }
  }

  // Handle video load completion (success or error)
  function onVideoLoadComplete() {
    currentlyLoading--;
    processQueue();
  }

  // Process next video in queue
  function processQueue() {
    if (loadingQueue.length > 0) {
      const next = loadingQueue.shift();
      const nextProjectName = getProjectName(next.container);
      debugLog(`\n⏭️  Processing queue - Next: [${nextProjectName}] (${loadingQueue.length} remaining in queue)`);
      loadVideoImmediately(next.container);
    } else {
      debugLog(`✨ Queue empty, all videos processed`);
    }
  }

  // Load video for a container based on what CSS is actually showing
  function loadVideoForContainer(container) {
    const visibleVideo = getVisibleVideo(container);

    if (visibleVideo) {
      loadSingleVideo(visibleVideo);
    }

    return visibleVideo; // Return the video that was actually loaded (or null)
  }

  // Load a single video's source
  function loadSingleVideo(video) {
    const sources = video.querySelectorAll('source[data-src]');

    sources.forEach(source => {
      const dataSrc = source.getAttribute('data-src');
      if (dataSrc) {
        source.setAttribute('src', dataSrc);
        source.removeAttribute('data-src');
      }
    });

    video.load();

    // Add error logging (event listeners for queue are added in loadVideoImmediately)
    video.addEventListener('error', function(e) {
      console.error('Video failed to load:', video.currentSrc, e);
    }, { once: true });

    // Set up ScrollTrigger for play/pause
    setupVideoScrollTrigger(video);
  }

  // Set up ScrollTrigger for individual video
  function setupVideoScrollTrigger(video) {
    const projectItem = video.closest('.overlapping-image-inner');

    if (!projectItem) return;

    const container = video.closest('.hero-video-wrapper');
    const projectName = getProjectName(container);

    debugLog(`🎯 [${projectName}] ScrollTrigger set up for play/pause control`);

    ScrollTrigger.create({
      trigger: projectItem,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        debugLog(`▶️  [${projectName}] ScrollTrigger: onEnter - Attempting to play`);
        if (video.paused) {
          video.play().then(() => {
            debugLog(`✅ [${projectName}] Video PLAYING`);
          }).catch(err => {
            debugWarn(`⚠️ [${projectName}] Autoplay prevented:`, err.message);
          });
        } else {
          debugLog(`ℹ️  [${projectName}] Already playing`);
        }
      },
      onLeave: () => {
        debugLog(`⏸️  [${projectName}] ScrollTrigger: onLeave - Pausing`);
        if (!video.paused) {
          video.pause();
          debugLog(`✅ [${projectName}] Video PAUSED`);
        }
      },
      onEnterBack: () => {
        debugLog(`▶️  [${projectName}] ScrollTrigger: onEnterBack - Attempting to play`);
        if (video.paused) {
          video.play().then(() => {
            debugLog(`✅ [${projectName}] Video PLAYING`);
          }).catch(err => {
            debugWarn(`⚠️ [${projectName}] Autoplay prevented:`, err.message);
          });
        } else {
          debugLog(`ℹ️  [${projectName}] Already playing`);
        }
      },
      onLeaveBack: () => {
        debugLog(`⏸️  [${projectName}] ScrollTrigger: onLeaveBack - Pausing`);
        if (!video.paused) {
          video.pause();
          debugLog(`✅ [${projectName}] Video PAUSED`);
        }
      }
    });
  }

  // Handle orientation changes (mobile rotation)
  function handleOrientationChange(lockMobileOrientation, mobileMaxWidth) {
    debugLog('Orientation change detected, reloading appropriate videos');

    // Update all video containers to show correct orientation
    document.querySelectorAll('.hero-video-wrapper').forEach(container => {
      const landscapeVideo = container.querySelector('.bgvid--landscape');
      const portraitVideo = container.querySelector('.bgvid--portrait');

      if (landscapeVideo && portraitVideo) {
        // Determine which video is now visible according to CSS
        const visibleVideo = getVisibleVideo(container);
        const hiddenVideo = visibleVideo === landscapeVideo ? portraitVideo : landscapeVideo;

        if (hiddenVideo) {
          // Preserve hidden video's source
          const hiddenSources = hiddenVideo.querySelectorAll('source[src]');
          hiddenSources.forEach(source => {
            const srcValue = source.getAttribute('src');
            if (srcValue) {
              source.removeAttribute('src');
              source.setAttribute('data-src', srcValue);
            }
          });

          // Pause hidden video if playing
          if (!hiddenVideo.paused) {
            hiddenVideo.pause();
          }
        }

        if (visibleVideo) {
          // Check if visible video needs its source loaded
          const visibleSources = visibleVideo.querySelectorAll('source[data-src]');
          if (visibleSources.length > 0) {
            // FIX: Use the queue system for orientation changes too
            loadVideoWithQueue(container);
          } else {
            // Already loaded, just play
            visibleVideo.play().catch(err => {
              debugLog("Autoplay prevented on orientation change:", err);
            });
          }
        }
      }
    });
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  window.ProjectVideoAutoplay();
});
