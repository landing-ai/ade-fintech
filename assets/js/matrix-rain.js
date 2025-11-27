// ================================
// Electric Championship Matrix Rain Effect
// Inspired by Financial Hackathon Championship NYC
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
    canvas.style.opacity = '0.85';

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Championship themed character sets - AI, Finance, Tech
    const aiChars = 'AI01ML10DL01NLP10CV01AGI10GPU01CPU10API01SDK10';
    const financeChars = '$€£¥₹%FINTECHBANKLOANDATACREDITRISKHEDGEFUNDETFIPO';
    const techChars = '</>{}[]()=+*&^%$#@!~`|\\:;,.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const binaryChars = '0101010111000111010100101010110101110001';

    // Mix all character sets
    const allChars = (aiChars + financeChars + techChars + binaryChars).split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Lightning bolt class for electric effects
    class Lightning {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.targetY = canvas.height;
            this.segments = [];
            this.life = 0;
            this.maxLife = 10 + Math.random() * 20;
            this.active = false;
            this.nextStrike = Date.now() + Math.random() * 10000 + 5000;

            // Generate lightning path
            let currentX = this.x;
            let currentY = this.y;
            const segmentCount = 15 + Math.floor(Math.random() * 10);

            for (let i = 0; i < segmentCount; i++) {
                const nextY = currentY + (this.targetY - this.y) / segmentCount;
                const nextX = currentX + (Math.random() - 0.5) * 50;
                this.segments.push({
                    x1: currentX,
                    y1: currentY,
                    x2: nextX,
                    y2: nextY
                });
                currentX = nextX;
                currentY = nextY;
            }
        }

        update() {
            if (Date.now() > this.nextStrike && !this.active) {
                this.active = true;
                this.reset();
            }

            if (this.active) {
                this.life++;
                if (this.life > this.maxLife) {
                    this.active = false;
                    this.life = 0;
                    this.nextStrike = Date.now() + Math.random() * 8000 + 3000;
                }
            }
        }

        draw(ctx) {
            if (!this.active) return;

            const alpha = 1 - (this.life / this.maxLife);

            // Main bolt
            ctx.strokeStyle = `rgba(150, 200, 255, ${alpha})`;
            ctx.lineWidth = 2 + Math.random() * 2;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00a8ff';

            ctx.beginPath();
            this.segments.forEach(segment => {
                ctx.moveTo(segment.x1, segment.y1);
                ctx.lineTo(segment.x2, segment.y2);
            });
            ctx.stroke();

            // Glow effect
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.shadowBlur = 0;
        }
    }

    // Rain drop class with electric blue/purple theme
    class RainDrop {
        constructor(x) {
            this.x = x;
            this.y = Math.random() * -100;
            this.speed = 0.5 + Math.random() * 1.5;
            this.opacity = 0.1 + Math.random() * 0.9;
            this.trail = [];
            this.maxTrailLength = 15 + Math.floor(Math.random() * 10);
            this.charChangeFreq = Math.random() * 0.1 + 0.05;
            this.chars = [];
            this.brightness = 0.5 + Math.random() * 0.5;
            this.colorMode = Math.random() > 0.5 ? 'blue' : 'purple';

            // Initialize trail characters
            for (let i = 0; i < this.maxTrailLength; i++) {
                this.chars[i] = allChars[Math.floor(Math.random() * allChars.length)];
            }
        }

        update() {
            this.y += this.speed;

            // Change characters occasionally
            for (let i = 0; i < this.chars.length; i++) {
                if (Math.random() < this.charChangeFreq) {
                    this.chars[i] = allChars[Math.floor(Math.random() * allChars.length)];
                }
            }

            // Reset when off screen
            if (this.y * fontSize > canvas.height + 100) {
                if (Math.random() > 0.975) {
                    this.reset();
                }
            }

            // Occasional random reset for variety
            if (Math.random() > 0.998) {
                this.reset();
            }
        }

        reset() {
            this.y = Math.random() * -100;
            this.speed = 0.5 + Math.random() * 1.5;
            this.opacity = 0.1 + Math.random() * 0.9;
            this.brightness = 0.5 + Math.random() * 0.5;
            this.colorMode = Math.random() > 0.5 ? 'blue' : 'purple';
        }

        draw(ctx, fontSize) {
            const x = this.x * fontSize;

            // Draw trail
            for (let i = 0; i < this.maxTrailLength; i++) {
                const y = (this.y - i) * fontSize;

                if (y < 0 || y > canvas.height) continue;

                const char = this.chars[i];

                // Calculate fade based on position in trail
                const fadeFactor = 1 - (i / this.maxTrailLength);
                const alpha = fadeFactor * this.opacity;

                if (i === 0) {
                    // Leading character - bright electric effect
                    ctx.shadowBlur = 25;

                    // Pulsing effect for leading character
                    const pulse = Math.sin(Date.now() * 0.003 + this.x) * 0.3 + 0.7;

                    if (this.colorMode === 'blue') {
                        ctx.shadowColor = '#00a8ff';
                        ctx.fillStyle = `rgba(150, 200, 255, ${alpha * pulse * this.brightness})`;
                    } else {
                        ctx.shadowColor = '#9945ff';
                        ctx.fillStyle = `rgba(200, 150, 255, ${alpha * pulse * this.brightness})`;
                    }
                    ctx.font = `bold ${fontSize}px monospace`;

                } else if (i < 3) {
                    // Near-leading characters - bright blue/purple
                    ctx.shadowBlur = 15;

                    if (this.colorMode === 'blue') {
                        ctx.shadowColor = '#0088ff';
                        ctx.fillStyle = `rgba(0, 150, 255, ${alpha * this.brightness})`;
                    } else {
                        ctx.shadowColor = '#7733ff';
                        ctx.fillStyle = `rgba(150, 50, 255, ${alpha * this.brightness})`;
                    }
                    ctx.font = `${fontSize}px monospace`;

                } else {
                    // Trail - fading blue/purple
                    ctx.shadowBlur = 0;

                    if (this.colorMode === 'blue') {
                        const blueValue = Math.floor(30 + (fadeFactor * 150));
                        ctx.fillStyle = `rgba(0, ${blueValue}, 255, ${alpha * 0.7 * this.brightness})`;
                    } else {
                        const purpleValue = Math.floor(30 + (fadeFactor * 100));
                        ctx.fillStyle = `rgba(${purpleValue}, 0, 255, ${alpha * 0.7 * this.brightness})`;
                    }
                    ctx.font = `${fontSize}px monospace`;
                }

                // Add slight horizontal offset for glitch effect occasionally
                const glitchX = (Math.random() > 0.995) ? (Math.random() - 0.5) * 3 : 0;
                ctx.fillText(char, x + glitchX, y);
            }

            ctx.shadowBlur = 0;
        }
    }

    // Initialize drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops.push(new RainDrop(i));
    }

    // Initialize lightning effects
    const lightningBolts = [];
    for (let i = 0; i < 3; i++) {
        lightningBolts.push(new Lightning());
    }

    // Add or remove drops on resize
    function updateDrops() {
        const newColumns = Math.floor(canvas.width / fontSize);
        if (newColumns > columns) {
            for (let i = columns; i < newColumns; i++) {
                drops.push(new RainDrop(i));
            }
        } else if (newColumns < columns) {
            drops.length = newColumns;
        }
        columns = newColumns;
    }
    window.addEventListener('resize', updateDrops);

    // Performance optimizations
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    // Draw the matrix
    function draw(currentTime) {
        requestAnimationFrame(draw);

        // Frame rate limiting for performance
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;

        lastTime = currentTime - (deltaTime % frameInterval);

        // Create fade effect with subtle blue tint
        ctx.fillStyle = 'rgba(0, 0, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle scan line effect with blue glow
        const scanLineY = (currentTime * 0.1) % canvas.height;
        const gradient = ctx.createLinearGradient(0, scanLineY - 10, 0, scanLineY + 10);
        gradient.addColorStop(0, 'rgba(0, 100, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanLineY - 10, canvas.width, 20);

        // Update and draw all drops
        for (let i = 0; i < drops.length; i++) {
            drops[i].update();
            drops[i].draw(ctx, fontSize);
        }

        // Update and draw lightning effects
        lightningBolts.forEach(bolt => {
            bolt.update();
            bolt.draw(ctx);
        });

        // Occasional screen flicker for electric effect
        if (Math.random() > 0.997) {
            const flickerGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            flickerGradient.addColorStop(0, 'rgba(150, 200, 255, 0.05)');
            flickerGradient.addColorStop(1, 'rgba(0, 50, 255, 0.02)');
            ctx.fillStyle = flickerGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Start animation
    requestAnimationFrame(draw);

    // Mouse interaction - electric surge effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Affect nearby drops with electric surge
        const affectRadius = 120;
        for (let drop of drops) {
            const dropX = drop.x * fontSize;
            const dropY = drop.y * fontSize;
            const distance = Math.sqrt(
                Math.pow(dropX - mouseX, 2) +
                Math.pow(dropY - mouseY, 2)
            );

            if (distance < affectRadius) {
                // Speed up and electrify nearby drops
                drop.speed = 2 + (1 - distance / affectRadius) * 4;
                drop.brightness = Math.min(1, drop.brightness + 0.4);
                // Switch to blue when electrified
                if (Math.random() > 0.7) {
                    drop.colorMode = 'blue';
                }
            }
        }
    });

    console.log('> FINANCIAL HACKATHON CHAMPIONSHIP MATRIX INITIALIZED');
    console.log('> ELECTRIC NEURAL NETWORK SYNCHRONIZED');
    console.log('> NYC CHAMPIONSHIP MODE ACTIVATED...');
    console.log('> WELCOME TO THE FUTURE OF FINANCE');

})();