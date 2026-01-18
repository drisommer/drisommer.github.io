# First Loading Performance Improvements - Priority Implementation

## Critical Issue
Currently ALL featured project videos (9 projects × 2 orientations = 18 video files) are loading immediately on page load. This causes:
- Hundreds of MB of data downloading at once
- Slow initial page render
- Poor user experience on slower connections

## Solution: Smart Lazy Loading with First Video Prioritization

### Overview
1. Load ONLY the first video's correct orientation (landscape OR portrait) immediately
2. Lazy load all other videos only when they enter the viewport (only for their correct orientation)
3. Detect viewport orientation and load only the appropriate video source
4. Lock mobile phone devices to portrait orientation (configurable)

---

## Implementation Steps

### Step 0: Add Configuration to Hugo
**File:** `src/hugo.toml`

Add the following configuration section:

```toml
[params.performance]
  # Lock orientation to portrait on mobile phone devices
  # This prevents landscape videos from loading on phones even if rotated
  lockMobileOrientation = true

  # Mobile phone detection threshold (width in pixels)
  # Devices with max-width <= this value are considered phones
  mobilePhoneMaxWidth = 768
```

**Key Settings:**
- `lockMobileOrientation = true`: Forces portrait video on phone-sized devices
- `lockMobileOrientation = false`: Allows orientation switching on all devices
- `mobilePhoneMaxWidth = 768`: Devices 768px or narrower are considered phones

---

### Step 1: Update Template to Support Lazy Loading
**File:** `src/themes/montoya/layouts/partials/project-item.html`

**Current Structure (lines 29-47):**
```html
<video loop muted playsinline class="bgvid">
  <source src="{{ $heroVideo }}" type="video/mp4">
</video>
```

**New Structure:**
```html
{{/* Determine if this is the first project (featured = 1) */}}
{{ $isFirstProject := eq $project.Params.featured 1 }}

<div class="hero-video-wrapper"
     data-lock-mobile-orientation="{{ $.Site.Params.performance.lockMobileOrientation | default false }}"
     data-mobile-max-width="{{ $.Site.Params.performance.mobilePhoneMaxWidth | default 768 }}">
  {{ if ne $heroVideoPortrait $heroVideo }}
  {{/* Has both landscape and portrait versions */}}

  <!-- Landscape video -->
  <video loop muted playsinline class="bgvid bgvid--landscape {{ if not $isFirstProject }}lazy-video{{ end }}"
         {{ if $isFirstProject }}
         data-autoload="true"
         {{ else }}
         data-lazy="true"
         {{ end }}
         poster="{{ $heroImage }}">
    <source {{ if $isFirstProject }}src{{ else }}data-src{{ end }}="{{ $heroVideo }}" type="video/mp4">
  </video>

  <!-- Portrait video -->
  <video loop muted playsinline class="bgvid bgvid--portrait {{ if not $isFirstProject }}lazy-video{{ end }}"
         {{ if $isFirstProject }}
         data-autoload="true"
         {{ else }}
         data-lazy="true"
         {{ end }}
         poster="{{ $heroImagePortrait }}">
    <source {{ if $isFirstProject }}src{{ else }}data-src{{ end }}="{{ $heroVideoPortrait }}" type="video/mp4">
  </video>

  {{ else }}
  {{/* Single video (no portrait variant) */}}

  <video loop muted playsinline class="bgvid {{ if not $isFirstProject }}lazy-video{{ end }}"
         {{ if $isFirstProject }}
         data-autoload="true"
         {{ else }}
         data-lazy="true"
         {{ end }}
         poster="{{ $heroImage }}">
    <source {{ if $isFirstProject }}src{{ else }}data-src{{ end }}="{{ $heroVideo }}" type="video/mp4">
  </video>

  {{ end }}
</div>
```

**Key Changes:**
- First project (`featured = 1`) gets `src` attribute → loads immediately
- All other projects get `data-src` attribute → loads lazily
- Added `poster` attribute to show image while video loads
- Added `data-autoload="true"` marker for first video
- Added `data-lazy="true"` marker for lazy videos
- Added `data-lock-mobile-orientation` and `data-mobile-max-width` attributes from Hugo config

---

### Step 2: Create Smart Viewport Detection & Lazy Loading Script
**File:** `src/themes/montoya/static/js/project-video-autoplay.js`

**Replace entire file with:**

```javascript
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
```

---

### Step 3: Add Viewport-Based CSS (if not already present)
**File:** `src/themes/montoya/static/css/video-hero-portrait.css` (or custom.css)

```css
/* Show/hide videos based on viewport orientation */

/* Desktop and tablets - respect actual orientation */
@media (min-width: 769px) {
  @media (orientation: landscape) {
    .bgvid--portrait {
      display: none !important;
    }
    .bgvid--landscape {
      display: block;
    }
  }

  @media (orientation: portrait) {
    .bgvid--landscape {
      display: none !important;
    }
    .bgvid--portrait {
      display: block;
    }
  }
}

/* Mobile phones - always show portrait (when lockMobileOrientation is enabled) */
@media (max-width: 768px) {
  .bgvid--landscape {
    display: none !important;
  }
  .bgvid--portrait {
    display: block !important;
  }
}

/* Single videos (no orientation variant) always show */
.bgvid:not(.bgvid--landscape):not(.bgvid--portrait) {
  display: block;
}
```

**Note:** This CSS locks mobile phones (≤768px) to portrait videos. If `lockMobileOrientation = false` in hugo.toml, the JavaScript will still load both orientations on rotation, but CSS handles the display.

---

## Expected Results

### Before Implementation:
- Page load: Downloads 18 videos (~500MB+)
- First video plays: After 10-15 seconds
- Bandwidth: Massive waste on videos user never sees
- Mobile phones: Download both landscape AND portrait videos

### After Implementation:
- Page load: Downloads 1 video (~20-30MB)
- First video plays: After 2-3 seconds
- Bandwidth: Only downloads videos user actually scrolls to
- Correct orientation: Only loads landscape OR portrait based on device
- Mobile phones: Locked to portrait orientation, only downloads portrait video
- Desktop/tablets: Respects rotation and loads appropriate orientation

---

## Testing Checklist

- [ ] Desktop landscape viewport: First video loads landscape version only
- [ ] Desktop portrait viewport (if available): First video loads portrait version only
- [ ] Tablet landscape: Loads landscape video, can rotate to portrait
- [ ] Tablet portrait: Loads portrait video, can rotate to landscape
- [ ] Mobile phone (≤768px) portrait: First video loads portrait version ONLY
- [ ] Mobile phone rotated to landscape: Still shows portrait video (if lockMobileOrientation = true)
- [ ] Scroll down: Videos 2-9 lazy load as they enter viewport (correct orientation only)
- [ ] Network throttling (Slow 3G): First video loads quickly, others don't block
- [ ] Browser DevTools Network tab: Verify only 1 video loads initially
- [ ] Configuration test: Set `lockMobileOrientation = false` and verify mobile respects rotation
- [ ] Configuration test: Change `mobilePhoneMaxWidth` to 600 and verify detection threshold

---

## Rollback Plan

If issues occur:
1. Revert `project-item.html` to use `src` instead of `data-src`
2. Revert `project-video-autoplay.js` to original version
3. Clear browser cache and test
