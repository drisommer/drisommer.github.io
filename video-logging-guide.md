# Video Loading Debug Logs - How to Read Them

## What You'll See in Console

The logs now track the complete lifecycle of each video with emoji indicators for easy scanning:

### 🎬 First Video Load (Page Load)
```
🎬 [Adidas - All In] FIRST VIDEO - Loading immediately on page load
[Adidas - All In] Only landscape video exists, CSS display: none
⚠️ [Adidas - All In] ⚠️ Landscape video hidden by CSS (landscape-only on portrait viewport)
⚠️ [Adidas - All In] First video container found but no visible video
```

### 🔍 Video Enters Viewport (IntersectionObserver)
```
🔍 [Pina - Snow Tha Product & Lauren Jauregui] ENTERED VIEWPORT - Triggering lazy load
```

### 📥 Queue Status
```
📥 [Pina - Snow Tha Product & Lauren Jauregui] Loading immediately (0/2 slots used)
```
or
```
⏳ [Google AcademyOfPop] QUEUED (2/2 slots full, queue length: 0)
```

### ✅ CSS Visibility Check
```
[Pina - Snow Tha Product & Lauren Jauregui] CSS visibility - Landscape: none, Portrait: block
✅ [Pina - Snow Tha Product & Lauren Jauregui] Loading PORTRAIT video
```

### 🎬 Video Loading
```
🎬 [Pina - Snow Tha Product & Lauren Jauregui] Starting video load (currentlyLoading: 1)
```

### ✅ Video Load Complete
```
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video loaded successfully
```

### 🎯 ScrollTrigger Setup
```
🎯 [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger set up for play/pause control
```

### ▶️ Video Play/Pause Events
```
▶️  [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger: onEnter - Attempting to play
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video PLAYING
```
```
⏸️  [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger: onLeave - Pausing
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video PAUSED
```

### ⏭️ Queue Processing
```
⏭️  Processing queue - Next: [Google AcademyOfPop] (2 remaining in queue)
```

### ✨ Queue Complete
```
✨ Queue empty, all videos processed
```

---

## Expected Flow for Portrait Mode

### Example: Scrolling through all 9 projects on mobile portrait

**Featured Projects in Order:**
1. Adidas (featured=1) - Landscape only
2. NBA (featured=2) - Landscape only
3. Pina (featured=3) - Both orientations
4. Aint-Afraid (featured=10) - Both
5. Boysmells (featured=10) - Both
6. Geechi (featured=10) - Both
7. Google AcademyOfPop (featured=10) - Both
8. Rico Nasty (featured=10) - Both
9. The Sims (featured=10) - Both

**Expected Log Sequence:**

```
=== PAGE LOAD ===
🎬 [Adidas - All In] FIRST VIDEO - Loading immediately on page load
[Adidas - All In] Only landscape video exists, CSS display: none
⚠️ [Adidas - All In] ⚠️ Landscape video hidden by CSS (landscape-only on portrait viewport)
⚠️ [Adidas - All In] First video container found but no visible video

=== USER SCROLLS DOWN ===

🔍 [NBA - Shai] ENTERED VIEWPORT - Triggering lazy load
📥 [NBA - Shai] Loading immediately (0/2 slots used)
🎬 [NBA - Shai] Starting video load (currentlyLoading: 1)
[NBA - Shai] Only landscape video exists, CSS display: none
⚠️ [NBA - Shai] ⚠️ Landscape video hidden by CSS (landscape-only on portrait viewport)
⚠️ [NBA - Shai] Container has no visible video, skipping load

=== CONTINUES SCROLLING ===

🔍 [Pina - Snow Tha Product & Lauren Jauregui] ENTERED VIEWPORT - Triggering lazy load
📥 [Pina - Snow Tha Product & Lauren Jauregui] Loading immediately (0/2 slots used)
🎬 [Pina - Snow Tha Product & Lauren Jauregui] Starting video load (currentlyLoading: 1)
[Pina - Snow Tha Product & Lauren Jauregui] CSS visibility - Landscape: none, Portrait: block
✅ [Pina - Snow Tha Product & Lauren Jauregui] Loading PORTRAIT video
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video loaded successfully
🎯 [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger set up for play/pause control

⏭️  Processing queue - Next: ... (if any queued)

▶️  [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger: onEnter - Attempting to play
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video PLAYING

=== USER SCROLLS PAST PINA ===

⏸️  [Pina - Snow Tha Product & Lauren Jauregui] ScrollTrigger: onLeave - Pausing
✅ [Pina - Snow Tha Product & Lauren Jauregui] Video PAUSED

=== CONTINUES FOR REMAINING PROJECTS ===
```

---

## How to Diagnose Issues

### Issue: Video doesn't load

**Look for:**
1. `🔍 [Project] ENTERED VIEWPORT` - Did IntersectionObserver fire?
2. `📥 [Project] Loading immediately` or `⏳ [Project] QUEUED` - Did it enter queue?
3. `✅ [Project] Loading PORTRAIT/LANDSCAPE video` - Did CSS visibility check pass?
4. `✅ [Project] Video loaded successfully` - Did the video file download?

**If missing any step, that's where the problem is!**

### Issue: Video doesn't play

**Look for:**
1. `🎯 [Project] ScrollTrigger set up` - Is ScrollTrigger configured?
2. `▶️ [Project] ScrollTrigger: onEnter` - Did ScrollTrigger fire?
3. `✅ [Project] Video PLAYING` - Did play() succeed?
4. `⚠️ [Project] Autoplay prevented` - Browser blocking autoplay?

### Issue: Video plays but immediately pauses

**Look for:**
```
▶️  [Project] ScrollTrigger: onEnter - Attempting to play
✅ [Project] Video PLAYING
⏸️  [Project] ScrollTrigger: onLeave - Pausing  ← IMMEDIATELY AFTER!
```

This means the video is leaving the viewport trigger zone too quickly.

**Possible causes:**
- ScrollTrigger start/end positions misconfigured
- Video element height causing it to immediately leave zone
- Multiple ScrollTriggers on same video conflicting

### Issue: Queue getting stuck

**Look for:**
```
⏳ [Project1] QUEUED (2/2 slots full, queue length: 0)
⏳ [Project2] QUEUED (2/2 slots full, queue length: 1)
⏳ [Project3] QUEUED (2/2 slots full, queue length: 2)
... (no more progress)
```

This means:
- 2 videos are loading but never completing
- `onVideoLoadComplete()` never called
- Event listeners not firing

**Check for:**
- Network errors preventing video load
- `❌ [Project] Video load ERROR` messages
- Videos stuck in loading state forever

---

## Common Patterns

### ✅ GOOD: Normal Flow
```
🔍 [Project] ENTERED VIEWPORT
📥 [Project] Loading immediately (0/2 slots used)
✅ [Project] Loading PORTRAIT video
✅ [Project] Video loaded successfully
🎯 [Project] ScrollTrigger set up
▶️  [Project] ScrollTrigger: onEnter
✅ [Project] Video PLAYING
```

### ⚠️ WARNING: Landscape-only on Portrait (Expected)
```
🔍 [Adidas] ENTERED VIEWPORT
📥 [Adidas] Loading immediately
⚠️ [Adidas] ⚠️ Landscape video hidden by CSS
⚠️ [Adidas] Container has no visible video, skipping load
```

### ❌ ERROR: Video Load Failed
```
🔍 [Project] ENTERED VIEWPORT
📥 [Project] Loading immediately
✅ [Project] Loading PORTRAIT video
❌ [Project] Video load ERROR: [error details]
```

### ❌ ERROR: Play Prevented
```
▶️  [Project] ScrollTrigger: onEnter
⚠️ [Project] Autoplay prevented: NotAllowedError
```

---

## What to Share for Debugging

If videos still aren't working, share:

1. **Full console output** from page load to the problem
2. **Which specific projects** don't play (e.g., "Pina through Academy")
3. **Whether they appear in logs** at all
4. **Where the log sequence stops** for those projects

Example report:
```
Problem: Pina doesn't play in portrait mode

Console shows:
🔍 [Pina] ENTERED VIEWPORT
📥 [Pina] Loading immediately (0/2 slots used)
✅ [Pina] Loading PORTRAIT video
✅ [Pina] Video loaded successfully
🎯 [Pina] ScrollTrigger set up
▶️  [Pina] ScrollTrigger: onEnter - Attempting to play
⚠️ [Pina] Autoplay prevented: NotAllowedError  ← THIS IS THE ISSUE

This means the browser is blocking autoplay due to autoplay policy.
```

---

## Tips

1. **Filter console logs:** Most browsers let you filter. Type the project name to see only those logs.

2. **Clear console between tests:** Hit "Clear" button before testing to see fresh sequence.

3. **Slow scroll:** Scroll slowly to see each video's log sequence clearly.

4. **Watch for timing:** If play/pause happen too close together, that's the issue.

5. **Network tab:** Open Network tab filtered by `.mp4` to see which videos download.

---

## Next Steps

After reviewing console logs, we'll know exactly:
- Are videos loading?
- Is CSS showing the right videos?
- Is ScrollTrigger firing?
- Is play() being called?
- Is browser blocking autoplay?

This will tell us the exact fix needed!
