# Video Debug Logging - Configuration Guide

## How to Control Debug Logs

Debug logging can be controlled in **two ways**:

### 1. Hugo Configuration (Permanent)

**File:** `src/hugo.toml`

```toml
[params.performance]
  # Enable detailed video loading debug logs in console
  # Set to false in production for cleaner console
  debugVideoLoading = true  # ← Change this
```

**When to use:**
- Development: Set to `true` to see all logs
- Production: Set to `false` for clean console

**Effect:** Applies to all page loads after Hugo rebuild

---

### 2. Browser Console (Temporary)

**Open DevTools Console and type:**

```javascript
// Enable debug logging
window.VideoDebug = true

// Disable debug logging
window.VideoDebug = false
```

**When to use:**
- Quick debugging without rebuilding Hugo
- Testing on production site
- Toggling logs on/off during a session

**Effect:** Immediate (affects new videos as they load)

**Note:** Resets on page refresh (reverts to Hugo config value)

---

## What Gets Logged

### When Debug is ON (`true`):

```
🎬 [Adidas - All In] FIRST VIDEO - Loading immediately on page load
[Adidas - All In] DOM check - Landscape: false, Portrait: false, Single: true
✅ [Adidas - All In] Returning single video (no orientation variant)
📥 [Adidas - All In] Loading first video immediately
✅ [Adidas - All In] First video PLAYING

📌 [NBA - Shai] Set up observer on SINGLE video
📊 Total containers to observe: 8

🔍 [NBA - Shai] ENTERED VIEWPORT - Triggering lazy load
📥 [NBA - Shai] Loading immediately (0/2 slots used)
🎬 [NBA - Shai] Starting video load (currentlyLoading: 1)
✅ [NBA - Shai] Video loaded successfully
🎯 [NBA - Shai] ScrollTrigger set up for play/pause control
▶️ [NBA - Shai] ScrollTrigger: onEnter - Attempting to play
✅ [NBA - Shai] Video PLAYING
⏸️ [NBA - Shai] ScrollTrigger: onLeave - Pausing
✅ [NBA - Shai] Video PAUSED

⏭️ Processing queue - Next: [Pina...] (2 remaining in queue)
✨ Queue empty, all videos processed
```

### When Debug is OFF (`false`):

```
(Only errors show - clean console!)

❌ [Project Name] Video load ERROR: NetworkError
❌ GSAP/ScrollTrigger failed to load after 10 attempts
```

---

## Common Workflows

### Development Workflow

1. **Set Hugo config to `true`:**
   ```toml
   debugVideoLoading = true
   ```

2. **Run Hugo server:**
   ```bash
   cd src
   hugo server
   ```

3. **Console shows all debug logs** - helpful for debugging!

---

### Production Workflow

1. **Set Hugo config to `false`:**
   ```toml
   debugVideoLoading = false
   ```

2. **Build and deploy:**
   ```bash
   cd src
   hugo
   ```

3. **Clean console** - only errors show

---

### Quick Debug on Live Site

**Without rebuilding/redeploying:**

1. Open site in browser
2. Open DevTools Console (F12)
3. Type: `window.VideoDebug = true`
4. Reload page
5. Scroll through projects - logs appear
6. When done: `window.VideoDebug = false`

---

## Debugging Tips

### To debug a specific project:

```javascript
// Enable debug
window.VideoDebug = true

// Then scroll to that project
// Watch console for its logs
```

### To see initial setup logs only:

```javascript
// Enable debug BEFORE page load
window.VideoDebug = true

// Then reload page
// You'll see all setup logs
```

### To debug queue system:

```javascript
window.VideoDebug = true

// Then scroll quickly through all projects
// Watch queue logs:
// "📥 Loading immediately (0/2 slots used)"
// "⏳ QUEUED (2/2 slots full)"
// "⏭️ Processing queue - Next: ..."
```

### To check which videos are being observed:

```javascript
window.VideoDebug = true

// Reload page and look for:
// "📌 [Project] Set up observer on PORTRAIT video"
// "📊 Total containers to observe: 8"
```

---

## Error Logs (Always Visible)

**These ALWAYS show, regardless of debug flag:**

```
❌ [Project] Video load ERROR: [error details]
  - Video file failed to download
  - Network error
  - 404 not found
  - Codec error

❌ [Project] First video failed to load: [URL]
  - First video on page load failed

❌ GSAP/ScrollTrigger failed to load after 10 attempts
  - GSAP library didn't load
  - Check CDN connection
```

**Why always visible:** Errors need attention regardless of debug mode!

---

## Quick Reference

| Action | Command | When |
|--------|---------|------|
| **Enable in Hugo** | Set `debugVideoLoading = true` in `hugo.toml` | Development |
| **Disable in Hugo** | Set `debugVideoLoading = false` in `hugo.toml` | Production |
| **Enable in Console** | `window.VideoDebug = true` | Quick debug |
| **Disable in Console** | `window.VideoDebug = false` | Clean console |
| **Check current state** | `window.VideoDebug` (shows true/false) | Any time |

---

## Default Behavior

**If not configured:** Defaults to `false` (no debug logs)

**On first page load:**
1. Checks `window.VideoDebug` - if set, uses it
2. Otherwise, reads `data-debug-video` from HTML (from Hugo config)
3. Falls back to `false` if neither exists

**Priority:**
1. Browser console value (`window.VideoDebug`)
2. Hugo config (`debugVideoLoading`)
3. Default (`false`)

---

## Example: Debugging "Videos Don't Load" Issue

1. **Enable debug:**
   ```javascript
   window.VideoDebug = true
   ```

2. **Reload page and scroll to problem video**

3. **Look for missing steps:**
   ```
   ✅ Should see: 🔍 ENTERED VIEWPORT
   ✅ Should see: 📥 Loading immediately
   ✅ Should see: ✅ Loading PORTRAIT/LANDSCAPE video
   ✅ Should see: ✅ Video loaded successfully
   ✅ Should see: 🎯 ScrollTrigger set up
   ✅ Should see: ▶️ onEnter - Attempting to play
   ✅ Should see: ✅ Video PLAYING
   ```

4. **If any step is missing, that's the problem!**

---

## Notes

- Debug logs use emojis for easy visual scanning
- Errors always use ❌ emoji and show regardless of flag
- Logs include project names for easy filtering
- Console.error() always shows (production-safe)
- Console.log/warn() only show when debug=true

---

## For Your Customer

**When reporting issues:**
1. Enable debug: `window.VideoDebug = true`
2. Reload page
3. Scroll to problem area
4. Screenshot console
5. Send to you

This gives you the exact failure point!
