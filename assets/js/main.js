// ================================
// LandingAI - Agentic Document Extraction Website
// Main JavaScript
// ================================

(function() {
    'use strict';

    // ================================
    // Navigation
    // ================================

    const nav = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scrolling for in-page anchor links only (not cross-page links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        // Only add smooth scrolling if the target exists on this page
        if (href !== '#' && document.querySelector(href)) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Nav background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // ================================
    // Projects Table
    // ================================

    async function loadProjects() {
        try {
            const response = await fetch('data/projects_data.json');
            const projects = await response.json();

            const tbody = document.getElementById('projects-tbody');
            if (!tbody) return;

            // Sort projects by team size (larger teams first)
            projects.sort((a, b) => b.team_size - a.team_size);

            tbody.innerHTML = projects.map(project => `
                <tr data-team-name="${project.team_name.toLowerCase()}">
                    <td><strong>${project.team_name}</strong></td>
                    <td>${project.team_size || 'N/A'}</td>
                    <td>
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                        ${project.youtube ? `<a href="${project.youtube}" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}
                    </td>
                </tr>
            `).join('');

            // Setup search functionality
            setupProjectSearch(projects);

        } catch (error) {
            console.error('Error loading projects:', error);
            const tbody = document.getElementById('projects-tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Error loading projects. Please refresh the page.</td></tr>';
            }
        }
    }

    function setupProjectSearch(projects) {
        const searchInput = document.getElementById('project-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#projects-tbody tr');

            rows.forEach(row => {
                const teamName = row.dataset.teamName;
                if (teamName.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // ================================
    // Gallery
    // ================================

    // YouTube Video & Playlist - LandingAI Financial Services Hackathon
    const MAIN_VIDEO_ID = '5WTxmkld9Lg'; // Main event highlights video
    const YOUTUBE_PLAYLIST_ID = 'PLrKGAzovU85fQ9XGETV2b-qL6P92RlrhX';

    function setupGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Load photos and videos
        loadGalleryItems();

        // Setup filter functionality
        setupGalleryFilters();
    }

    async function loadGalleryItems() {
        const galleryGrid = document.getElementById('gallery-grid');

        // Check if we have photos in the gallery folder
        const photos = await loadPhotos();

        if (photos.length === 0 && YOUTUBE_PLAYLIST_ID === 'YOUR_PLAYLIST_ID_HERE') {
            // Show placeholder if no content yet
            galleryGrid.innerHTML = `
                <div class="gallery-placeholder">
                    <h3>Gallery Coming Soon!</h3>
                    <p>Photos and videos from the hackathon will be added here.</p>
                    <p>Check back soon to see all the amazing moments!</p>
                </div>
            `;
            return;
        }

        let html = '';

        // Add main highlight video
        if (MAIN_VIDEO_ID) {
            html += createMainVideoSection();
        }

        // Add YouTube playlist section if available
        if (YOUTUBE_PLAYLIST_ID !== 'YOUR_PLAYLIST_ID_HERE') {
            html += createYouTubeSection();
        }

        // Add photos
        photos.forEach(photo => {
            html += createPhotoItem(photo);
        });

        galleryGrid.innerHTML = html || `
            <div class="gallery-placeholder">
                <p>Loading gallery...</p>
            </div>
        `;
    }

    function createMainVideoSection() {
        return `
            <div class="main-video-section" data-category="videos">
                <div class="youtube-embed" style="margin-bottom: 3rem;">
                    <h3 style="font-size: 1.8rem; margin-bottom: 1rem;">Event Highlights - Financial Services AI Hackathon</h3>
                    <iframe
                        width="100%"
                        height="500"
                        src="https://www.youtube.com/embed/${MAIN_VIDEO_ID}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                    <p class="youtube-link">
                        <a href="https://www.youtube.com/watch?v=${MAIN_VIDEO_ID}" target="_blank" rel="noopener noreferrer">
                            Watch on YouTube →
                        </a>
                    </p>
                </div>
            </div>
        `;
    }

    function createYouTubeSection() {
        return `
            <div class="youtube-section" data-category="videos">
                <div class="youtube-embed">
                    <h3>Hackathon Highlights</h3>
                    <iframe
                        width="100%"
                        height="400"
                        src="https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                    <p class="youtube-link">
                        <a href="https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}" target="_blank" rel="noopener noreferrer">
                            View Full Playlist on YouTube →
                        </a>
                    </p>
                </div>
            </div>
        `;
    }

    async function loadPhotos() {
        // Event photos from LandingAI Financial Services Hackathon
        const photoFiles = [
            'event-001.jpg',
            'event-002.jpg',
            'event-003.jpg',
            'event-004.jpg',
            'event-005.jpg',
            'event-006.jpg',
            'event-007.jpg',
            'event-008.jpg',
            'event-009.jpg',
            'event-010.jpg',
        ];

        return photoFiles;
    }

    function createPhotoItem(filename) {
        return `
            <div class="gallery-item" data-category="photos">
                <img src="assets/images/gallery/${filename}" alt="Hackathon Event" loading="lazy">
            </div>
        `;
    }

    function setupGalleryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                filterGalleryItems(filter);
            });
        });
    }

    function filterGalleryItems(filter) {
        const items = document.querySelectorAll('.gallery-item');

        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // ================================
    // Intersection Observer for Animations
    // ================================

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and sections
        document.querySelectorAll('.about-card, .stat-card, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ================================
    // Stats Counter Animation
    // ================================

    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const target = stat.textContent.replace(/[^0-9]/g, '');
            if (!target) return;

            const duration = 2000;
            const increment = parseInt(target) / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = stat.textContent.replace(/[0-9]+/, Math.floor(current));
            }, 16);
        });
    }

    // Trigger stats animation when section is visible
    function setupStatsObserver() {
        const statsSection = document.querySelector('.community-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ================================
    // Initialize Everything
    // ================================

    function init() {
        console.log('LandingAI - Agentic Document Extraction');
        console.log('Initializing website...');

        // Load dynamic content
        loadProjects();
        setupGallery();

        // Setup interactions
        setupScrollAnimations();
        setupStatsObserver();

        console.log('Website initialized successfully!');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
