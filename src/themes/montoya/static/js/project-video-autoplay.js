// Smart Video Loading with First Video Priority and Viewport Detection
window.ProjectVideoAutoplay = function() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initSmartVideoLoading();
  } else {
    setTimeout(checkGSAP, 1000);
  }

  function checkGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initSmartVideoLoading();
    } else {
      setTimeout(checkGSAP, 1000);
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

    // Step 2: Detect device type and orientation
    const isMobilePhone = window.innerWidth <= mobileMaxWidth;
    const currentOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    // Step 3: Determine which orientation to use
    let isPortrait;
    if (lockMobileOrientation && isMobilePhone) {
      // Lock to portrait on mobile phones
      isPortrait = true;
      console.log('Mobile phone detected - locked to portrait orientation');
    } else {
      // Use current viewport orientation
      isPortrait = currentOrientation === 'portrait';
    }

    // Step 4: Handle first video (immediate load with correct orientation)
    handleFirstVideo(isPortrait);

    // Step 5: Set up lazy loading for all other videos
    setupLazyVideoLoading(isPortrait, lockMobileOrientation, mobileMaxWidth);

    // Step 6: Listen for orientation changes (mobile rotation)
    window.addEventListener('resize', debounce(() => {
      handleOrientationChange(lockMobileOrientation, mobileMaxWidth);
    }, 300));
  }

  // Handle first video - load immediately with correct orientation
  function handleFirstVideo(isPortrait) {
    const firstVideoContainer = document.querySelector('[data-autoload="true"]')?.closest('.hero-video-wrapper');

    if (!firstVideoContainer) return;

    const landscapeVideo = firstVideoContainer.querySelector('.bgvid--landscape');
    const portraitVideo = firstVideoContainer.querySelector('.bgvid--portrait');

    if (landscapeVideo && portraitVideo) {
      // Has both orientations - choose the correct one
      const activeVideo = isPortrait ? portraitVideo : landscapeVideo;
      const inactiveVideo = isPortrait ? landscapeVideo : portraitVideo;

      // Remove the inactive video's source to prevent download
      const inactiveSources = inactiveVideo.querySelectorAll('source');
      inactiveSources.forEach(source => {
        source.removeAttribute('src');
        source.setAttribute('data-src', source.getAttribute('src') || source.getAttribute('data-src'));
      });

      // Ensure active video starts loading
      activeVideo.load();
      activeVideo.play().catch(err => {
        console.log("First video autoplay prevented:", err);
      });
    } else {
      // Single orientation - just play it
      const video = firstVideoContainer.querySelector('video');
      if (video) {
        video.load();
        video.play().catch(err => {
          console.log("First video autoplay prevented:", err);
        });
      }
    }
  }

  // Set up Intersection Observer for lazy loading
  function setupLazyVideoLoading(isPortrait, lockMobileOrientation, mobileMaxWidth) {
    const lazyVideos = document.querySelectorAll('.lazy-video[data-lazy="true"]');

    if (lazyVideos.length === 0) return;

    // Create Intersection Observer
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;

          // Re-check orientation for this video (might have scrolled after rotation)
          const isMobilePhone = window.innerWidth <= mobileMaxWidth;
          let currentIsPortrait;

          if (lockMobileOrientation && isMobilePhone) {
            currentIsPortrait = true; // Always portrait on mobile phones
          } else {
            currentIsPortrait = window.innerHeight > window.innerWidth;
          }

          loadVideoSource(video, currentIsPortrait);
          observer.unobserve(video); // Stop observing once loaded
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before video enters viewport
    });

    // Observe all lazy videos
    lazyVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }

  // Load video source when it enters viewport
  function loadVideoSource(video, isPortrait) {
    const videoContainer = video.closest('.hero-video-wrapper');

    if (!videoContainer) {
      // Single video, just load it
      loadSingleVideo(video);
      return;
    }

    const landscapeVideo = videoContainer.querySelector('.bgvid--landscape');
    const portraitVideo = videoContainer.querySelector('.bgvid--portrait');

    if (landscapeVideo && portraitVideo) {
      // Has both orientations - load only the correct one
      const targetVideo = isPortrait ? portraitVideo : landscapeVideo;
      loadSingleVideo(targetVideo);
    } else {
      // Single orientation
      loadSingleVideo(video);
    }
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

    // Set up ScrollTrigger for play/pause
    setupVideoScrollTrigger(video);
  }

  // Set up ScrollTrigger for individual video
  function setupVideoScrollTrigger(video) {
    const projectItem = video.closest('.overlapping-image-inner');

    if (!projectItem) return;

    ScrollTrigger.create({
      trigger: projectItem,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        if (video.paused) {
          video.play().catch(err => {
            console.log("Autoplay prevented:", err);
          });
        }
      },
      onLeave: () => {
        if (!video.paused) {
          video.pause();
        }
      },
      onEnterBack: () => {
        if (video.paused) {
          video.play().catch(err => {
            console.log("Autoplay prevented:", err);
          });
        }
      },
      onLeaveBack: () => {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }

  // Handle orientation changes (mobile rotation)
  function handleOrientationChange(lockMobileOrientation, mobileMaxWidth) {
    const isMobilePhone = window.innerWidth <= mobileMaxWidth;

    // Determine new orientation
    let newIsPortrait;
    if (lockMobileOrientation && isMobilePhone) {
      // Keep locked to portrait on mobile phones
      newIsPortrait = true;
      console.log('Orientation locked to portrait on mobile phone');
    } else {
      // Use current viewport orientation
      newIsPortrait = window.innerHeight > window.innerWidth;
    }

    // Update all loaded videos to show correct orientation
    document.querySelectorAll('.hero-video-wrapper').forEach(container => {
      const landscapeVideo = container.querySelector('.bgvid--landscape');
      const portraitVideo = container.querySelector('.bgvid--portrait');

      if (landscapeVideo && portraitVideo) {
        // Both exist - manage visibility via CSS classes handled by existing styles
        // The CSS already handles this with media queries
        // When locked to portrait on mobile, portrait video always shows
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
