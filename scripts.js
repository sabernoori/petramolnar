document.addEventListener("DOMContentLoaded", function () {
    const testimonySlider = new Swiper(".swiper.is-testimony", {
        // Parameters
        loop: true,
        slidesPerView: 2,
        centeredSlides: true,
        speed: 800,
        grabCursor: true,
        // Navigation arrows
        navigation: {
            nextEl: '.arrow_right',
            prevEl: '.arrow_left',
        },
        parallax: true,
        autoplay: {
            delay: 18000, // Time between slides in milliseconds (3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interactions
        },
    });

    // Get all work items
    const workItems = document.querySelectorAll('.work_item');
    
    workItems.forEach(item => {
        // Find the video element within this work item
        const video = item.querySelector('.work-card_video');
        
        if (video) {
            // Store the original source if it exists
            const originalSrc = video.getAttribute('src');
            
            // Remove source on load to prevent auto-loading
            if (originalSrc) {
                video.removeAttribute('src');
                video.load();
                // Store the source in data-bg-vid without a preset value
                video.setAttribute('data-bg-vid', originalSrc);
            }
            
            // Set up hover events
            item.addEventListener('mouseenter', () => {
                // Get the stored source from data-bg-vid
                const videoSrc = video.getAttribute('data-bg-vid');
                
                if (videoSrc && !video.getAttribute('src')) {
                    video.setAttribute('src', videoSrc);
                    video.load();
                }
                
                // Set loop and play
                video.loop = true;
                video.play().catch(error => {
                    console.log('Video play failed:', error);
                });
            });
            
            item.addEventListener('mouseleave', () => {
                // Pause video when hover ends
                video.pause();
                // Optional: Reset video to start
                video.currentTime = 0;
            });
        }
    });
});