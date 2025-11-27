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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    function setupGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Placeholder for now - will be populated with actual media
        galleryGrid.innerHTML = `
            <div class="gallery-placeholder">
                <p>Gallery will be populated with photos and videos from the hackathon event.</p>
                <p>Media files are currently being downloaded...</p>
            </div>
        `;

        // Setup filter functionality
        setupGalleryFilters();
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
