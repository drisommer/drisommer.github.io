jQuery(function($) {
    // Function to initialize site title animations
    function initSiteTitleAnimations() {
        // Check if we're on the home page by looking for the home-page class
        const siteTitleElement = $('#site-title.home-page');
        
        if (siteTitleElement.length) {
            // Make sure ScrollTrigger is available
            if (typeof ScrollTrigger !== 'undefined') {
                console.log("Initializing site title scroll animations");
                
                // Set initial state (hidden)
                gsap.set(siteTitleElement, {
                    opacity: 0,
                    visibility: 'hidden'
                });
                
                // Calculate 80% of window height
                const scrollThreshold = window.innerHeight * 0.8;
                
                // Create a ScrollTrigger for the animation
                ScrollTrigger.create({
                    start: scrollThreshold + " top", // Start at 80% of window height
                    end: "bottom top",
                    onEnter: () => {
                        // When scrolling down past the threshold
                        gsap.to(siteTitleElement, {
                            opacity: 1,
                            visibility: 'visible',
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    },
                    onLeaveBack: () => {
                        // When scrolling back up past the threshold
                        gsap.to(siteTitleElement, {
                            opacity: 0,
                            visibility: 'hidden',
                            duration: 0.5,
                            ease: 'power2.in'
                        });
                    }
                });
            } else {
                console.warn("ScrollTrigger not available, falling back to basic animation");
                
                // Fallback to basic scroll-based animation
                $(window).on('scroll', function() {
                    const scrollTop = $(window).scrollTop();
                    const threshold = window.innerHeight * 0.8;
                    
                    if (scrollTop > threshold) {
                        siteTitleElement.css({
                            'opacity': 1,
                            'visibility': 'visible'
                        });
                    } else {
                        siteTitleElement.css({
                            'opacity': 0,
                            'visibility': 'hidden'
                        });
                    }
                });
                
                // Trigger initial check
                $(window).trigger('scroll');
            }
        }
    }
    
    // Initialize on document ready
    $(document).ready(function() {
        initSiteTitleAnimations();
    });
    
    // Also initialize on window load to ensure all resources are loaded
    $(window).on('load', function() {
        initSiteTitleAnimations();
    });
    
    // Handle AJAX page transitions if the theme uses them
    $(document).on('ajaxLoaded', function() {
        setTimeout(initSiteTitleAnimations, 100);
    });
});
