// ================================
// Video Player - Standalone Module
// NYC Financial Hackathon Championship
// ================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    console.log('> INITIALIZING VIDEO PLAYER MODULE');

    // Get elements
    const watchVideoBtn = document.getElementById('watch-video-btn');
    const videoShowcase = document.getElementById('video-showcase');
    const closeVideoBtn = document.getElementById('close-video');
    const videoIframe = document.getElementById('championship-video');

    // Check if elements exist
    if (!watchVideoBtn || !videoShowcase || !closeVideoBtn || !videoIframe) {
        console.warn('Video player elements not found');
        return;
    }

    console.log('> VIDEO ELEMENTS FOUND');

    // NYC Championship Video ID
    const videoId = '5WTxmkld9Lg';

    // Show video function
    function showVideo(e) {
        e.preventDefault();
        console.log('> OPENING VIDEO SHOWCASE');

        // Set video source
        const videoUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
        videoIframe.src = videoUrl;

        // Show the showcase
        videoShowcase.style.display = 'flex';

        // Trigger animation after a small delay
        setTimeout(function() {
            videoShowcase.classList.add('active');
        }, 10);

        // Prevent scrolling
        document.body.style.overflow = 'hidden';

        console.log('> VIDEO SHOWCASE ACTIVE');
    }

    // Hide video function
    function hideVideo() {
        console.log('> CLOSING VIDEO SHOWCASE');

        // Remove active class
        videoShowcase.classList.remove('active');

        // Hide after animation
        setTimeout(function() {
            videoShowcase.style.display = 'none';
            // Clear video source to stop playback
            videoIframe.src = '';
        }, 500);

        // Re-enable scrolling
        document.body.style.overflow = '';

        console.log('> VIDEO SHOWCASE CLOSED');
    }

    // Attach event listeners
    watchVideoBtn.addEventListener('click', showVideo);
    closeVideoBtn.addEventListener('click', hideVideo);

    // Close on background click
    videoShowcase.addEventListener('click', function(e) {
        if (e.target === videoShowcase) {
            hideVideo();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoShowcase.classList.contains('active')) {
            hideVideo();
        }
    });

    console.log('> VIDEO PLAYER MODULE READY');
});