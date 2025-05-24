// Auto-play videos when they come into the viewport

// Global function to initialize video autoplay (can be called from AJAX page loads)
window.ProjectVideoAutoplay = function() {
  // Wait for GSAP and ScrollTrigger to be available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initVideoAutoplay();
  } else {
    // If GSAP is loaded later, check again after a short delay
    setTimeout(checkGSAP, 1000);
  }

  function checkGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initVideoAutoplay();
    } else {
      setTimeout(checkGSAP, 1000);
    }
  }

  function initVideoAutoplay() {
    // Find all project items with videos
    const projectItemsWithVideo = document.querySelectorAll('.overlapping-image-inner .hero-video-wrapper video');
    
    if (projectItemsWithVideo.length === 0) {
      return; // No videos to handle
    }
    
    // Register ScrollTrigger plugin if needed
    if (gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Create a ScrollTrigger for each video
    projectItemsWithVideo.forEach(video => {
      // Get the parent project item
      const projectItem = video.closest('.overlapping-image-inner');
      
      if (!projectItem) return;
      
      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: projectItem,
        start: "top 80%", // Start when the top of the element is 80% from the top of the viewport
        end: "bottom 20%", // End when the bottom of the element is 20% from the top of the viewport
        onEnter: () => {
          // Play video when it enters the viewport
          if (video.paused) {
            video.play().catch(err => {
              // Handle autoplay restrictions (some browsers require user interaction)
              console.log("Autoplay prevented:", err);
            });
          }
        },
        onLeave: () => {
          // Pause the video when it leaves the viewport
          if (!video.paused) {
            video.pause();
          }
        },
        onEnterBack: () => {
          // Play video when it re-enters the viewport
          if (video.paused) {
            video.play().catch(err => {
              console.log("Autoplay prevented:", err);
            });
          }
        },
        onLeaveBack: () => {
          // Pause the video when it leaves the viewport
          if (!video.paused) {
            video.pause();
          }
        }
      });
    });

    // All devices now use scroll-based video autoplay
    // Hover functionality for cursor effects only (no video control) is handled in scripts.js
  }
};

// Initialize on DOMContentLoaded for the first page load
document.addEventListener("DOMContentLoaded", function() {
  window.ProjectVideoAutoplay();
});
