// ================================
// Matrix Digital Rain Effect
// ================================

(function() {
    'use strict';

    // Create canvas for matrix rain
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.5';

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - katakana, latin letters, numbers, and symbols
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/';
    const chars = matrixChars.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Initialize drops - one per column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start above screen with random delays
    }

    // Draw the matrix
    function draw() {
        // Black background with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Matrix green text
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Draw character
            ctx.fillText(text, x, y);

            // Add brighter character at the front of the trail
            if (drops[i] * fontSize > 0 && drops[i] * fontSize < canvas.height) {
                ctx.fillStyle = '#39ff14'; // Brighter green for front
                ctx.fillText(text, x, y);
                ctx.fillStyle = '#00ff41'; // Return to normal green
            }

            // Reset drop to top randomly after it crosses the screen
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Increment Y coordinate
            drops[i]++;

            // Randomly reset some drops for variety
            if (Math.random() > 0.99) {
                drops[i] = 0;
            }
        }
    }

    // Animation loop
    setInterval(draw, 33); // ~30 FPS for smooth animation

    console.log('> MATRIX DIGITAL RAIN INITIALIZED');
    console.log('> SYSTEM ONLINE');
    console.log('> WELCOME TO THE REAL WORLD');

})();
