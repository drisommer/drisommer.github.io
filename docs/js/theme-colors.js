// Theme color helper functions
// This script helps apply theme colors dynamically to elements

document.addEventListener('DOMContentLoaded', function() {
    // Get the primary color from the body
    const primaryColor = document.body.getAttribute('data-primary-color');
    
    // Apply primary color to elements that need it
    if (primaryColor) {
        // Apply to cursor
        const magicCursorBall = document.querySelector('#magic-cursor #ball');
        if (magicCursorBall) {
            magicCursorBall.style.borderColor = primaryColor;
        }
        
        // Apply to links hover state via CSS variable
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        
        // Convert hex to RGB for the CSS variable
        const hexToRgb = hex => {
            // Remove the hash
            const cleanHex = hex.replace('#', '');
            
            // Parse the hex values to RGB
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            
            return [r, g, b];
        };
        
        // Set the RGB version of the primary color
        const rgb = hexToRgb(primaryColor);
        document.documentElement.style.setProperty('--primary-color-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
    }
      // Function to update theme colors for team members
    function applyTeamMembersTheme() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const lightText = getComputedStyle(document.documentElement).getPropertyValue('--light-text').trim();
        const paragraphColor = getComputedStyle(document.documentElement).getPropertyValue('--paragraph-color').trim();
        
        // Apply colors to team member elements
        const teamMemberTitles = document.querySelectorAll('.team-member .primary-font-title');
        teamMemberTitles.forEach(title => {
            title.style.color = lightText;
        });
        
        const teamMemberSpans = document.querySelectorAll('.team-member > span');
        teamMemberSpans.forEach(span => {
            span.style.color = paragraphColor;
        });
        
        // Add hover effect
        const teamMembers = document.querySelectorAll('.team-members-list li');
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                const title = this.querySelector('.primary-font-title');
                if (title) {
                    title.style.color = primaryColor;
                }
            });
            
            member.addEventListener('mouseleave', function() {
                const title = this.querySelector('.primary-font-title');
                if (title) {
                    title.style.color = lightText;
                }
            });
        });
    }
    
    // Function to update theme colors for moving gallery
    function applyMovingGalleryTheme() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const lightText = getComputedStyle(document.documentElement).getPropertyValue('--light-text').trim();
        
        // Apply colors to moving gallery elements
        const galleryCaptions = document.querySelectorAll('.moving-gallery-caption');
        galleryCaptions.forEach(caption => {
            caption.style.color = lightText;
        });
        
        // Add hover effect
        const galleryItems = document.querySelectorAll('.moving-gallery li');
        galleryItems.forEach(item => {
            const link = item.querySelector('a');
            const caption = item.querySelector('.moving-gallery-caption');
            
            if (link && caption) {
                link.addEventListener('mouseenter', function() {
                    caption.style.color = primaryColor;
                });
                
                link.addEventListener('mouseleave', function() {
                    caption.style.color = lightText;
                });
            }
        });
    }
    
    // Apply curtain colors
    const curtainElements = document.querySelectorAll('.curtains');
    curtainElements.forEach(el => {
        const curtainColor = el.getAttribute('data-curtain-color');
        
        // Replace with dark background color if it's the default
        if (curtainColor === '#0c0c0c') {
            el.setAttribute('data-curtain-color', getComputedStyle(document.documentElement).getPropertyValue('--dark-background').trim());
        }
    });
    
    // Style filters for better visibility
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        // Enhance the active filter visibility
        if (option.classList.contains('is_active')) {
            option.style.backgroundColor = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb')}, 0.1)`;
            option.style.boxShadow = `0 0 0 1px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}`;
        }
        
        // Add hover effect
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('is_active')) {
                this.style.backgroundColor = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb')}, 0.05)`;
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('is_active')) {
                this.style.backgroundColor = 'transparent';
            }
        });
    });
    
    // Enhance contact page elements
    const boxIcons = document.querySelectorAll('.box-icon');
    if (boxIcons.length > 0) {
        boxIcons.forEach(icon => {
            // Apply primary color to icons
            icon.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            icon.style.borderColor = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb')}, 0.3)`;
            
            // Add hover effect
            const iconWrapper = icon.closest('.box-icon-wrapper');
            if (iconWrapper) {
                iconWrapper.addEventListener('mouseenter', function() {
                    icon.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                    icon.style.color = getComputedStyle(document.documentElement).getPropertyValue('--light-text');
                    icon.style.transform = 'translateY(-5px)';
                    icon.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                });
                
                iconWrapper.addEventListener('mouseleave', function() {
                    icon.style.backgroundColor = 'transparent';
                    icon.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                    icon.style.transform = 'translateY(0)';
                    icon.style.boxShadow = 'none';
                });
            }
        });
    }
    
    // Style contact buttons
    const contactButtons = document.querySelectorAll('.dark-section .button-border');
    if (contactButtons.length > 0) {
        contactButtons.forEach(button => {
            // Apply styles on hover
            button.addEventListener('mouseenter', function() {
                this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                this.style.backgroundColor = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb')}, 0.1)`;
                const buttonLink = this.querySelector('a');
                if (buttonLink) {
                    buttonLink.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--light-text');
                this.style.backgroundColor = 'transparent';
                const buttonLink = this.querySelector('a');
                if (buttonLink) {
                    buttonLink.style.color = getComputedStyle(document.documentElement).getPropertyValue('--light-text');
                }
            });
        });    }
    
    // Apply to team members and moving gallery components
    applyTeamMembersTheme();
    applyMovingGalleryTheme();
    
    // Function to update theme colors for team members
    function applyTeamMembersTheme() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const lightText = getComputedStyle(document.documentElement).getPropertyValue('--light-text').trim();
        const paragraphColor = getComputedStyle(document.documentElement).getPropertyValue('--paragraph-color').trim();
        
        // Apply colors to team member elements
        const teamMemberTitles = document.querySelectorAll('.team-member .primary-font-title');
        teamMemberTitles.forEach(title => {
            title.style.color = lightText;
        });
        
        const teamMemberSpans = document.querySelectorAll('.team-member > span');
        teamMemberSpans.forEach(span => {
            span.style.color = paragraphColor;
        });
        
        // Add hover effect
        const teamMembers = document.querySelectorAll('.team-members-list li');
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                const title = this.querySelector('.primary-font-title');
                if (title) {
                    title.style.color = primaryColor;
                }
            });
            
            member.addEventListener('mouseleave', function() {
                const title = this.querySelector('.primary-font-title');
                if (title) {
                    title.style.color = lightText;
                }
            });
        });
    }
    
    // Function to update theme colors for moving gallery
    function applyMovingGalleryTheme() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const lightText = getComputedStyle(document.documentElement).getPropertyValue('--light-text').trim();
        
        // Apply colors to moving gallery elements
        const galleryCaptions = document.querySelectorAll('.moving-gallery-caption');
        galleryCaptions.forEach(caption => {
            caption.style.color = lightText;
        });
        
        // Add hover effect
        const galleryItems = document.querySelectorAll('.moving-gallery li');
        galleryItems.forEach(item => {
            const link = item.querySelector('a');
            const caption = item.querySelector('.moving-gallery-caption');
            
            if (link && caption) {
                link.addEventListener('mouseenter', function() {
                    caption.style.color = primaryColor;
                });
                
                link.addEventListener('mouseleave', function() {
                    caption.style.color = lightText;
                });
            }
        });
    }
});
