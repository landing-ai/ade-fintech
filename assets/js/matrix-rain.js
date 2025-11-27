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
    canvas.style.opacity = '0.7';

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
        drops[i] = Math.random() * -100;
    }

    // Draw the matrix
    function draw() {
        // Black background with fade effect - creates the trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Authentic Matrix color palette - darker, muted greens
            // Leading character is brighter but not white
            const isLeading = y > 0 && y < canvas.height;

            if (isLeading) {
                // Bright leading character (like in the movie)
                ctx.fillStyle = '#cefbe4'; // Pale green/white for leading edge
            } else {
                // Body of the trail - darker green
                ctx.fillStyle = '#0aff0a'; // Medium-dark green
            }

            ctx.fillText(text, x, y);

            // Draw fading characters in the trail behind
            const trailLength = 15;
            for (let j = 1; j < trailLength; j++) {
                const trailY = (drops[i] - j) * fontSize;
                if (trailY > 0) {
                    // Gradually fade from green to dark
                    const alpha = 1 - (j / trailLength);
                    const darkness = Math.floor(10 + (alpha * 30)); // Ranges from 10 to 40
                    ctx.fillStyle = `rgb(0, ${darkness}, 0)`;
                    ctx.fillText(
                        chars[Math.floor(Math.random() * chars.length)],
                        x,
                        trailY
                    );
                }
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
