# Website Loading Performance Improvements - Complete Guide

## Executive Summary

Current website performance issues stem from:
1. **All 18 videos (9 projects × 2 orientations) downloading immediately** (~500MB+)
2. Duplicate image loading
3. Heavy JavaScript payload (421KB local + CDN libraries)
4. No resource optimization (lazy loading, preconnect, etc.)
5. Redundant downloads (portrait videos on desktop, landscape on mobile)

**Expected improvement with all optimizations:** 90%+ reduction in initial page load time and bandwidth.

---

## Priority 1: Smart Lazy Video Loading ⭐⭐⭐

**Impact:** 🚀 CRITICAL - Will reduce initial page load from ~500MB to ~20-30MB

### Current Issue
- All 9 featured project videos load immediately
- Both landscape AND portrait versions download regardless of device
- Total: 18 video files downloading at once

### Solution
See detailed implementation in `first-loading-perf-improvements.md`

**Files to modify:**
- `src/themes/montoya/layouts/partials/project-item.html`
- `src/themes/montoya/static/js/project-video-autoplay.js`

**Expected gains:**
- Initial load: 500MB → 20-30MB (95% reduction)
- Time to first video: 10-15s → 2-3s
- Bandwidth: Only loads videos user actually views

---

## Priority 2: Remove Duplicate Images ⭐⭐

**Impact:** 🔥 HIGH - Reduces image bandwidth by 50%

### Current Issue
**File:** `src/themes/montoya/layouts/partials/project-item.html` (lines 18-27, 49-58)

Each project loads the same hero image twice:
```html
<!-- First instance (lines 19-26) -->
<img src="{{ $heroImage }}" class="item-image grid__item-img" alt="...">

<!-- Duplicate (lines 50-57) -->
<img src="{{ $heroImage }}" class="grid__item-img grid__item-img--large" alt="...">
```

### Solution

**Option A: Remove duplicate if not needed**
Delete lines 49-58 if the large grid image serves no purpose.

**Option B: Make it lazy if needed for layout**
```html
<img src="{{ $heroImage }}"
     class="grid__item-img grid__item-img--large"
     alt="{{ $project.Title }}"
     loading="lazy">
```

**Expected gains:**
- 50% reduction in image downloads
- Faster initial render

---

## Priority 3: Add Resource Hints ⭐⭐

**Impact:** 🔥 MEDIUM-HIGH - Improves connection to Azure Blob Storage

### Current Issue
No DNS prefetch or preconnect to video/image host (`drisommer.blob.core.windows.net`)
Browser must:
1. DNS lookup
2. TCP connection
3. TLS handshake
4. Then download resources

This adds 300-800ms latency per resource.

### Solution
**File:** `src/themes/montoya/layouts/_default/baseof.html`

Add in `<head>` section (before line 28):
```html
<!-- Resource hints for Azure Blob Storage -->
<link rel="preconnect" href="https://drisommer.blob.core.windows.net">
<link rel="dns-prefetch" href="https://drisommer.blob.core.windows.net">

<!-- Preconnect to external CDNs -->
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

**Expected gains:**
- 300-800ms faster first video/image load
- Parallel connection establishment

---

## Priority 4: Image Lazy Loading ⭐⭐

**Impact:** 🔥 MEDIUM - Defers offscreen images

### Current Issue
All hero images load immediately, even those far down the page.

### Solution
**File:** `src/themes/montoya/layouts/partials/project-item.html`

Update all `<img>` tags:

```html
<!-- For first project (featured = 1) - eager load -->
{{ if eq $project.Params.featured 1 }}
<img src="{{ $heroImage }}"
     class="item-image grid__item-img"
     alt="{{ $project.Title }}"
     loading="eager">
{{ else }}
<!-- For all other projects - lazy load -->
<img src="{{ $heroImage }}"
     class="item-image grid__item-img"
     alt="{{ $project.Title }}"
     loading="lazy">
{{ end }}
```

**Expected gains:**
- Defers loading of 8 out of 9 project images
- Faster initial page render

---

## Priority 5: Optimize JavaScript Loading ⭐

**Impact:** 🔶 MEDIUM - Improves parse/execution time

### Current Issue
**File:** `src/themes/montoya/layouts/partials/footer-scripts.html`

All scripts load synchronously in footer:
- `common.js`: 135KB
- `scripts.js`: 83KB
- `plugins.js`: 66KB
- `jquery.min.js`: 88KB
- Total local JS: 421KB + CDN libraries

### Solution A: Add defer attribute
```html
<script src="/js/jquery.min.js"></script>
<script src="/js/jquery-ensure.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/Flip.min.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/smooth-scrollbar/8.4.0/smooth-scrollbar.js'></script>

<!-- Non-critical scripts with defer -->
<script defer src="/js/clapat.js"></script>
<script defer src="/js/plugins.js"></script>
<script defer src="/js/common.js"></script>
<script defer src="/js/contact.js"></script>
<script defer src="/js/scripts.js"></script>
<script defer src="/js/project-video-autoplay.js"></script>
<script defer src="/js/site-title.js"></script>
```

### Solution B: Minify local scripts
Use Hugo asset pipeline or build tools:
```html
{{ $common := resources.Get "js/common.js" | minify }}
{{ $scripts := resources.Get "js/scripts.js" | minify }}
<script defer src="{{ $common.RelPermalink }}"></script>
<script defer src="{{ $scripts.RelPermalink }}"></script>
```

**Expected gains:**
- Faster page parse (defer prevents blocking)
- 20-30% smaller file sizes (minification)
- Better Time to Interactive (TTI)

---

## Priority 6: Conditional Portrait Loading ⭐

**Impact:** 🔶 MEDIUM - Saves bandwidth on wrong-orientation videos

### Current Issue
Projects with portrait variants load BOTH videos, even though CSS hides one.

Example (NBA-x-SGA):
- Desktop loads: landscape.mp4 (displays) + portrait.mp4 (hidden)
- Mobile loads: landscape.mp4 (hidden) + portrait.mp4 (displays)

### Solution
Already covered in Priority 1 (first-loading-perf-improvements.md)

The viewport detection logic ensures only the correct orientation loads.

**Expected gains:**
- 50% reduction in video bandwidth for dual-orientation projects
- Faster loading on mobile

---

## Priority 7: Optimize Preloader ⭐

**Impact:** 🔷 LOW-MEDIUM - Better perceived performance

### Current Issue
**File:** `src/themes/montoya/layouts/partials/preloader.html`

Preloader might be hiding content while resources still download in background.

### Solution
Update preloader logic to:
1. Show progress for actual resource loading
2. Hide preloader as soon as first video is ready
3. Don't wait for all images/videos

**File:** `src/themes/montoya/static/js/scripts.js` (PageLoad function)

Consider reducing preloader delay or making it more accurate.

**Expected gains:**
- Better user perception
- Faster perceived load time

---

## Priority 8: CSS Optimization 🔷

**Impact:** 🔷 LOW - Minor improvement

### Current Issue
- `style.css`: 73KB
- Multiple CSS files loaded separately
- No minification

### Solution
**File:** `src/themes/montoya/layouts/_default/baseof.html`

Use Hugo asset pipeline:
```html
{{ $style := resources.Get "style.css" | minify }}
{{ $custom := resources.Get "css/custom.css" | minify }}
{{ $videoTrigger := resources.Get "css/video-trigger.css" | minify }}
{{ $combined := slice $style $custom $videoTrigger | resources.Concat "bundle.css" | minify }}
<link href="{{ $combined.RelPermalink }}" rel="stylesheet">
```

**Expected gains:**
- Fewer HTTP requests
- Smaller file sizes
- Faster CSS parse

---

## Priority 9: Implement Video Poster Images 🔷

**Impact:** 🔷 LOW-MEDIUM - Better placeholder experience

### Current Issue
Videos show blank while loading.

### Solution
Already added in Priority 1 implementation:
```html
<video poster="{{ $heroImage }}">
```

This shows the hero image while video loads.

**Expected gains:**
- Better visual experience
- No blank placeholders

---

## Priority 10: Consider Next-Gen Image Formats 🔷

**Impact:** 🔷 LOW - Requires more work for moderate gains

### Current Issue
All images are JPG/PNG format.

### Solution
Generate WebP/AVIF versions:

```html
<picture>
  <source srcset="{{ $heroImage }}.avif" type="image/avif">
  <source srcset="{{ $heroImage }}.webp" type="image/webp">
  <img src="{{ $heroImage }}" alt="..." loading="lazy">
</picture>
```

**Expected gains:**
- 25-35% smaller image sizes
- Faster image loads

**Considerations:**
- Requires image conversion pipeline
- Need fallback support
- More complex build process

---

## Priority 11: Implement Service Worker Caching 🔷

**Impact:** 🔷 LOW - Better for repeat visits

### Current Issue
No offline support or aggressive caching.

### Solution
Create service worker for caching static assets:

**File:** `src/static/sw.js`

```javascript
const CACHE_VERSION = 'v1';
const CACHE_NAME = `drisommer-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/style.css',
  '/js/scripts.js',
  '/js/common.js',
  // Add other static resources
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Expected gains:**
- Instant load on repeat visits
- Offline support
- Better mobile experience

---

## Priority 12: Responsive Video Sources 🔷

**Impact:** 🔷 LOW-MEDIUM - Requires video re-encoding

### Current Issue
Same video resolution served to all devices (desktop and mobile).

### Solution
Create multiple resolutions:
- Desktop: 1920x1080 (high quality)
- Tablet: 1280x720 (medium quality)
- Mobile: 854x480 (lower quality)

```html
<video>
  <source
    src="{{ $heroVideo }}-480p.mp4"
    type="video/mp4"
    media="(max-width: 767px)">
  <source
    src="{{ $heroVideo }}-720p.mp4"
    type="video/mp4"
    media="(max-width: 1024px)">
  <source
    src="{{ $heroVideo }}.mp4"
    type="video/mp4">
</video>
```

**Expected gains:**
- 50-70% smaller video files on mobile
- Faster mobile loading

**Considerations:**
- Requires video re-encoding
- More storage needed
- More complex deployment

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 hours, HUGE impact)
1. ✅ Add resource hints (Priority 3)
2. ✅ Add `loading="lazy"` to images (Priority 4)
3. ✅ Remove duplicate images (Priority 2)

**Expected improvement:** 30-40% faster initial load

---

### Phase 2: Critical Fixes (3-6 hours, MASSIVE impact)
4. ✅ Implement smart lazy video loading (Priority 1)
   - Update `project-item.html`
   - Rewrite `project-video-autoplay.js`
   - Add viewport detection
   - Test across devices

**Expected improvement:** 90% reduction in bandwidth, 5-10s faster first video

---

### Phase 3: JavaScript Optimization (2-3 hours, MEDIUM impact)
5. ✅ Add defer to scripts (Priority 5)
6. ✅ Minify local scripts (Priority 5)
7. ✅ Optimize preloader (Priority 7)

**Expected improvement:** 20-30% faster Time to Interactive

---

### Phase 4: Polish (2-4 hours, LOW-MEDIUM impact)
8. ✅ Combine/minify CSS (Priority 8)
9. ✅ Verify poster images work (Priority 9)

**Expected improvement:** Minor, but cleaner codebase

---

### Phase 5: Advanced (Future, VARIABLE impact)
10. ⏭️ Next-gen image formats (Priority 10) - Requires pipeline
11. ⏭️ Service worker caching (Priority 11) - Better repeat visits
12. ⏭️ Responsive video sources (Priority 12) - Requires re-encoding

---

## Testing Strategy

### Before Implementation
Run baseline tests:
```bash
# Using Chrome DevTools
1. Open DevTools → Network tab
2. Disable cache
3. Load homepage
4. Record:
   - Total page size
   - Number of requests
   - Time to first video play
   - Largest Contentful Paint (LCP)
```

Expected baseline:
- Page size: 500-700MB
- Requests: 30-40
- Time to first video: 10-15s
- LCP: 8-12s

### After Phase 1 (Quick Wins)
- Page size: 350-450MB (duplicate images removed)
- Requests: 25-35
- Time to first video: 8-12s
- LCP: 6-10s

### After Phase 2 (Lazy Loading)
- Page size: 20-40MB (only first video + images)
- Requests: 10-15
- Time to first video: 2-4s
- LCP: 2-4s

### After Phase 3 (JS Optimization)
- Time to Interactive: 3-5s (vs 8-12s before)
- First Contentful Paint: 1-2s

---

## Monitoring & Validation

### Tools to Use
1. **Chrome DevTools**
   - Network tab: Monitor actual downloads
   - Performance tab: Analyze loading timeline
   - Lighthouse: Overall performance score

2. **WebPageTest.org**
   - Test from different locations
   - Simulate 3G/4G connections
   - Filmstrip view to see loading progression

3. **GTmetrix**
   - Automated performance reports
   - Historical tracking
   - Waterfall analysis

### Key Metrics to Track
- **Total Page Weight:** Target < 50MB
- **Time to First Video:** Target < 3s
- **Largest Contentful Paint (LCP):** Target < 2.5s
- **First Input Delay (FID):** Target < 100ms
- **Cumulative Layout Shift (CLS):** Target < 0.1
- **Lighthouse Performance Score:** Target > 90

---

## Rollback Plan

If any implementation causes issues:

1. **Git rollback:**
   ```bash
   git checkout HEAD~1 src/themes/montoya/layouts/partials/project-item.html
   git checkout HEAD~1 src/themes/montoya/static/js/project-video-autoplay.js
   ```

2. **Feature flags:**
   Add to `hugo.toml`:
   ```toml
   [params.performance]
     lazyLoadVideos = true
     lazyLoadImages = true
     optimizeJS = true
   ```

   Then use conditionals in templates:
   ```html
   {{ if .Site.Params.performance.lazyLoadVideos }}
     <!-- New lazy loading code -->
   {{ else }}
     <!-- Original code -->
   {{ end }}
   ```

3. **Staged rollout:**
   - Test on staging environment first
   - Deploy to production
   - Monitor for 24 hours
   - Rollback if issues detected

---

## Success Criteria

### Minimum Viable Success (Phase 1-2)
- ✅ Page loads under 50MB on first visit
- ✅ First video plays within 3 seconds
- ✅ No broken videos or images
- ✅ Works on Chrome, Safari, Firefox
- ✅ Works on iOS and Android

### Full Success (All Phases)
- ✅ Lighthouse Performance Score > 90
- ✅ Page loads under 30MB
- ✅ LCP < 2.5s
- ✅ No layout shifts (CLS < 0.1)
- ✅ Smooth scrolling maintained
- ✅ All interactive elements work

---

## Notes

- Focus on Phase 1-2 first for maximum impact
- Test thoroughly on real devices (not just DevTools)
- Monitor real user metrics after deployment
- Consider implementing feature flags for gradual rollout
- Document all changes for future maintenance
