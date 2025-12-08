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
    if (navToggle && navMenu) {
        console.log('Mobile menu initialized');
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open', isActive);
            console.log('Menu toggled, active:', isActive);
        });
    } else {
        console.log('Nav elements not found:', { navToggle, navMenu });
    }

    // Close mobile menu when clicking on a link
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    });

    // ================================
    // Projects Table with Pagination
    // ================================

    let allProjects = [];
    let currentPage = 1;
    const projectsPerPage = 10;

    async function loadProjects() {
        try {
            const response = await fetch('data/projects_data.json?v=36');
            allProjects = await response.json();
            console.log('Loaded projects:', allProjects.length);
            console.log('First project:', allProjects[0].team_name, {
                hasAbstract: !!allProjects[0].abstract,
                hasSummary: !!allProjects[0].summary,
                hasYouTube: !!allProjects[0].youtube
            });

            // Projects are already ordered: Champion → Honorable Mentions → Best Online Apps → Others
            // No sorting needed - preserve JSON order

            displayProjectsPage(1);
            setupPagination();

        } catch (error) {
            console.error('Error loading projects:', error);
            const tbody = document.getElementById('projects-tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Error loading projects. Please refresh the page.</td></tr>';
            }
        }
    }

    // Clean up team member names: remove emails, clean formatting, put on separate lines
    function formatTeamMembers(text) {
        if (!text) return '';

        // Remove email addresses
        text = text.replace(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g, '');

        // Remove "First name:" and "Last Name:" patterns
        text = text.replace(/First\s+name:\s*/gi, '');
        text = text.replace(/Last\s+Name:\s*/gi, '');

        // Remove parentheses and their contents
        text = text.replace(/\([^)]*\)/g, '');

        // Split by common separators and clean up
        let names = text.split(/[,\n]+/).map(name => {
            return name.trim()
                .replace(/\s+/g, ' ')  // Normalize spaces
                .replace(/^[-\s]+|[-\s]+$/g, '');  // Remove leading/trailing dashes and spaces
        }).filter(name => name.length > 0 && name.length < 100);  // Filter out empty or too long entries

        // Join with newlines for proper display
        return names.join('\n');
    }

    function displayProjectsPage(page) {
        currentPage = page;
        const tbody = document.getElementById('projects-tbody');
        if (!tbody) return;

        const startIndex = (page - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const projectsToShow = allProjects.slice(startIndex, endIndex);

            tbody.innerHTML = projectsToShow.map((project, index) => {
                const globalIndex = startIndex + index; // For unique IDs across all pages
                const abstract = project.abstract || 'AI-powered solution for financial services';
                const summary = project.summary || 'This innovative project leverages cutting-edge AI technology to solve real-world challenges in financial services, demonstrating practical applications of document extraction and analysis.';
                const hasVideo = project.youtube && project.youtube !== 'No' && project.youtube !== 'Will be share shortly';
                const teamMembers = formatTeamMembers(project.team_members || '');

                return `
                <tr class="project-row" data-team-name="${project.team_name.toLowerCase()}" data-index="${globalIndex}">
                    <td><strong>${project.team_name}</strong></td>
                    <td class="abstract-cell">${abstract}</td>
                    <td class="links-cell">
                        ${hasVideo ? `<button class="demo-btn view-details-btn" data-index="${globalIndex}">View Details</button>` : ''}
                    </td>
                </tr>
                <tr class="project-details" id="details-${globalIndex}" style="display: none;">
                    <td colspan="3">
                        <div class="details-content">
                            <!-- Executive Summary Section -->
                            <div class="summary-section">
                                <h4>Executive Summary</h4>
                                <p>${summary}</p>
                                <div class="team-info">
                                    <strong>Team Size:</strong> ${project.team_size || 'N/A'}<br>
                                    ${teamMembers ? `<strong>Team Members:</strong><br>${teamMembers.replace(/\n/g, '<br>')}` : ''}
                                </div>
                            </div>

                            <!-- Links Section -->
                            <div class="links-section">
                                <h4>Project Links</h4>
                                <div class="project-links">
                                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link github-link">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        View on GitHub
                                    </a>` : ''}
                                    ${project.youtube && project.youtube !== 'No' && project.youtube !== 'Will be share shortly' ? `<a href="${project.youtube}" target="_blank" rel="noopener noreferrer" class="project-link youtube-link">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                        Watch on YouTube
                                    </a>` : ''}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');

            // Setup row click handlers
            setupProjectRowHandlers();

            // Update pagination buttons
            updatePaginationButtons();
    }

    function setupPagination() {
        const totalPages = Math.ceil(allProjects.length / projectsPerPage);
        const paginationContainer = document.getElementById('pagination-controls');
        if (!paginationContainer) return;

        let paginationHTML = `
            <button class="page-btn prev-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                ← Previous
            </button>
        `;

        // Show page numbers with proper ellipsis
        let lastShownPage = 0;
        for (let i = 1; i <= totalPages; i++) {
            // Show first, last, current, and adjacent pages
            const shouldShow = i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1);

            if (shouldShow) {
                // Add ellipsis if there's a gap
                if (i - lastShownPage > 1) {
                    paginationHTML += `<span class="page-ellipsis">...</span>`;
                }

                paginationHTML += `
                    <button class="page-btn page-number ${i === currentPage ? 'active' : ''}"
                            onclick="goToPage(${i})">
                        ${i}
                    </button>
                `;
                lastShownPage = i;
            }
        }

        paginationHTML += `
            <button class="page-btn next-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                Next →
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    function updatePaginationButtons() {
        setupPagination();

        // Update page info
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            const startIndex = (currentPage - 1) * projectsPerPage + 1;
            const endIndex = Math.min(currentPage * projectsPerPage, allProjects.length);
            pageInfo.textContent = `Showing ${startIndex}-${endIndex} of ${allProjects.length} projects`;
        }
    }

    // Make goToPage available globally
    window.goToPage = function(page) {
        const totalPages = Math.ceil(allProjects.length / projectsPerPage);
        if (page < 1 || page > totalPages) return;

        // Scroll to top of table
        const tableContainer = document.querySelector('.projects');
        if (tableContainer) {
            tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        displayProjectsPage(page);
    };

    function extractVideoInfo(url) {
        if (!url || url === 'No' || url === 'Will be share shortly') return null;

        // YouTube
        const youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const youtubeMatch = url.match(youtubeRegExp);
        if (youtubeMatch && youtubeMatch[7].length === 11) {
            return {
                type: 'youtube',
                id: youtubeMatch[7],
                embedUrl: `https://www.youtube.com/embed/${youtubeMatch[7]}`
            };
        }

        // Loom
        const loomRegExp = /loom\.com\/share\/([a-zA-Z0-9]+)/;
        const loomMatch = url.match(loomRegExp);
        if (loomMatch) {
            return {
                type: 'loom',
                id: loomMatch[1],
                embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`
            };
        }

        // Vimeo
        const vimeoRegExp = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoRegExp);
        if (vimeoMatch) {
            return {
                type: 'vimeo',
                id: vimeoMatch[1],
                embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
            };
        }

        return null;
    }

    // Keep old function for backwards compatibility
    function extractYouTubeId(url) {
        const videoInfo = extractVideoInfo(url);
        return videoInfo ? videoInfo.id : null;
    }

    function setupProjectRowHandlers() {
        const rows = document.querySelectorAll('.project-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const index = row.dataset.index;
                const detailsRow = document.getElementById(`details-${index}`);
                const isVisible = detailsRow.style.display !== 'none';

                // Close all other expanded rows
                document.querySelectorAll('.project-details').forEach(detail => {
                    detail.style.display = 'none';
                });
                document.querySelectorAll('.project-row').forEach(r => {
                    r.classList.remove('expanded');
                });

                // Toggle current row
                if (!isVisible) {
                    detailsRow.style.display = 'table-row';
                    row.classList.add('expanded');
                } else {
                    detailsRow.style.display = 'none';
                    row.classList.remove('expanded');
                }
            });

            // Add cursor pointer style
            row.style.cursor = 'pointer';
        });

        // Handle "View Details" button clicks
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click
                const index = button.dataset.index;
                const row = document.querySelector(`.project-row[data-index="${index}"]`);
                if (row) {
                    row.click(); // Trigger row expansion
                }
            });
        });
    }

    function setupProjectSearch() {
        const searchInput = document.getElementById('project-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            if (!searchTerm) {
                // Reset to page 1 with all projects
                displayProjectsPage(1);
                return;
            }

            // Filter projects and show all matches (no pagination during search)
            const filteredProjects = allProjects.filter(p =>
                p.team_name.toLowerCase().includes(searchTerm)
            );

            const tbody = document.getElementById('projects-tbody');
            if (!tbody) return;

            if (filteredProjects.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px;">No projects found matching your search.</td></tr>';
                document.getElementById('pagination-controls').style.display = 'none';
                document.getElementById('page-info').textContent = 'No results';
                return;
            }

            // Show all filtered results
            tbody.innerHTML = filteredProjects.map((project, index) => {
                const videoInfo = extractVideoInfo(project.youtube);
                const abstract = project.abstract || 'AI-powered solution for financial services';
                const summary = project.summary || 'This innovative project leverages cutting-edge AI technology to solve real-world challenges in financial services, demonstrating practical applications of document extraction and analysis.';
                const hasVideo = videoInfo || (project.youtube && project.youtube !== 'No' && project.youtube !== 'Will be share shortly');
                const globalIndex = allProjects.indexOf(project);
                const teamMembers = formatTeamMembers(project.team_members || '');

                return `
                <tr class="project-row" data-team-name="${project.team_name.toLowerCase()}" data-index="${globalIndex}">
                    <td><strong>${project.team_name}</strong></td>
                    <td class="abstract-cell">${abstract}</td>
                    <td class="links-cell">
                        ${hasVideo ? `<button class="demo-btn view-details-btn" data-index="${globalIndex}">View Details</button>` : ''}
                    </td>
                </tr>
                <tr class="project-details" id="details-${globalIndex}" style="display: none;">
                    <td colspan="3">
                        <div class="details-content">
                            <div class="summary-section">
                                <h4>Executive Summary</h4>
                                <p>${summary}</p>
                                <div class="team-info">
                                    <strong>Team Size:</strong> ${project.team_size || 'N/A'}<br>
                                    ${teamMembers ? `<strong>Team Members:</strong><br>${teamMembers.replace(/\n/g, '<br>')}` : ''}
                                </div>
                            </div>
                            ${videoInfo ? `
                            <div class="video-section">
                                <h4>Demo Video</h4>
                                <div class="video-container">
                                    <iframe width="100%" height="400" src="${videoInfo.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                            ` : ''}
                            <div class="links-section">
                                <h4>Project Links</h4>
                                <div class="project-links">
                                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link github-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>View on GitHub</a>` : ''}
                                    ${project.youtube && project.youtube !== 'No' && project.youtube !== 'Will be share shortly' ? `<a href="${project.youtube}" target="_blank" rel="noopener noreferrer" class="project-link youtube-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>Watch on YouTube</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');

            setupProjectRowHandlers();
            document.getElementById('pagination-controls').style.display = 'none';
            document.getElementById('page-info').textContent = `Found ${filteredProjects.length} matching projects`;
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

        // Setup image zoom functionality
        setTimeout(() => setupImageZoom(), 500);
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
        return ''; // Removed - keeping only Hackathon Reels
    }

    function createYouTubeSection() {
        return `
            <div class="youtube-section" data-category="videos">
                <div class="youtube-embed">
                    <h3>Glimpses from the Event</h3>
                    <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                    <p class="youtube-link">
                        <span>Full Playlist</span>
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
            'event-011.jpg',
            'event-012.jpg',
            'event-013.jpg',
            'event-014.jpg',
            'event-015.jpg',
            'event-016.jpg',
        ];

        return photoFiles;
    }

    function createPhotoItem(filename) {
        return `
            <div class="gallery-item" data-category="photos">
                <img src="assets/images/gallery/${filename}" alt="Hackathon Event" loading="lazy" class="zoomable-image">
            </div>
        `;
    }

    function setupImageZoom() {
        // Create zoom modal
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <span class="zoom-close">&times;</span>
            <img class="zoom-content" alt="Zoomed image">
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector('.zoom-content');
        const closeBtn = modal.querySelector('.zoom-close');

        // Add click handlers to all zoomable images
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoomable-image')) {
                modal.style.display = 'flex';
                modalImg.src = e.target.src;
                modalImg.alt = e.target.alt;
                document.body.style.overflow = 'hidden';
            }
        });

        // Close modal handlers
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
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
        const youtubeSection = document.querySelector('.youtube-section');

        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Hide video section when photos filter is active
        if (youtubeSection) {
            if (filter === 'photos') {
                youtubeSection.style.display = 'none';
            } else {
                youtubeSection.style.display = 'block';
            }
        }
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
    // Video Showcase Functionality
    // ================================

    function setupVideoShowcase() {
        const watchVideoBtn = document.getElementById('watch-video-btn');
        const videoShowcase = document.getElementById('video-showcase');
        const closeVideoBtn = document.getElementById('close-video');
        const videoIframe = document.getElementById('championship-video');

        if (!watchVideoBtn || !videoShowcase) return;

        // NYC Financial Hackathon Championship 2024 Video
        // Official highlights video from the championship event
        const videoId = '5WTxmkld9Lg'; // NYC Championship Highlights

        // Function to show video
        function showVideo() {
            // Set the video source when showing
            const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
            videoIframe.src = videoUrl;

            // Add active class with slight delay for animation
            videoShowcase.classList.add('loading');
            setTimeout(() => {
                videoShowcase.classList.remove('loading');
                videoShowcase.classList.add('active');
            }, 100);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Add electric effect to button
            watchVideoBtn.style.display = 'none';

            console.log('> VIDEO SHOWCASE ACTIVATED');
            console.log('> STREAMING CHAMPIONSHIP HIGHLIGHTS...');
        }

        // Function to hide video
        function hideVideo() {
            // Remove video source to stop playback
            videoIframe.src = '';

            // Remove active class
            videoShowcase.classList.remove('active');

            // Re-enable body scroll
            document.body.style.overflow = '';

            // Show button again
            setTimeout(() => {
                watchVideoBtn.style.display = 'inline-flex';
            }, 500);

            console.log('> VIDEO SHOWCASE DEACTIVATED');
        }

        // Event listeners
        watchVideoBtn.addEventListener('click', showVideo);
        closeVideoBtn.addEventListener('click', hideVideo);

        // Close on background click
        videoShowcase.addEventListener('click', (e) => {
            if (e.target === videoShowcase) {
                hideVideo();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoShowcase.classList.contains('active')) {
                hideVideo();
            }
        });
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

        // Setup video showcase
        setupVideoShowcase();

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
