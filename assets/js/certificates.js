// ========================================
// Certificate verification
// ========================================
(function() {
    'use strict';

    // Use encrypted file path (.enc extension)
    const csvPath = 'data/certificate_list.enc';
    const useEncryption = true; // Set to false for testing with plain CSV

    const lookupForm = document.getElementById('certificate-lookup-form');
    const lookupInput = document.getElementById('certificate-id');
    const lookupAlert = document.getElementById('lookup-alert');
    const renderTarget = document.getElementById('certificate-render');
    const displayWrapper = document.getElementById('certificate-display-wrapper');
    const credentialIdLink = document.getElementById('certificate-credential-id');
    const credentialIdText = document.getElementById('credential-id-text');
    const issuedToName = document.getElementById('issued-to-name');

    let certificates = [];

    // Deterministic short ID based on name + email
    function generateCertId(name, email) {
        const input = `${(name || '').trim().toLowerCase()}|${(email || '').trim().toLowerCase()}`;
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = (hash << 5) - hash + input.charCodeAt(i);
            hash |= 0; // Convert to 32-bit int
        }
        const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
        return `ADE-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
    }

    function parseCsv(text) {
        const rows = text.trim().split(/\r?\n/);
        const headers = rows.shift().split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(h => h.trim());
        return rows
            .map(row => row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/))
            .map(cols => {
                const record = {};
                headers.forEach((h, idx) => record[h] = (cols[idx] || '').replace(/^"|"$/g, '').trim());
                const name = record['Name'] || record['Full Name'] || '';
                const email = record['Email'] || '';
                const role = record['Designation/Position'] || record['Role'] || 'Participant';
                return {
                    name,
                    email,
                    role,
                    id: generateCertId(name, email)
                };
            })
            .filter(entry => entry.name || entry.email);
    }

    async function loadCertificates() {
        try {
            let text;

            if (useEncryption) {
                // Fetch and decrypt encrypted file
                console.log('Loading encrypted certificates...');

                if (typeof window.CertCrypto === 'undefined') {
                    throw new Error('Crypto utilities not loaded');
                }

                text = await window.CertCrypto.fetchAndDecrypt(`${csvPath}?v=${Date.now()}`);
                console.log('Certificates decrypted successfully');
            } else {
                // Fallback to plain CSV (for development/testing)
                const res = await fetch(`data/certificate_list.csv?v=${Date.now()}`);
                text = await res.text();
            }

            certificates = parseCsv(text);
            console.log(`Certificates loaded: ${certificates.length}`);
        } catch (err) {
            console.error('Failed to load certificates', err);
            setAlert(lookupAlert, 'error', 'Could not load certificate records. Please retry.');
        }
    }

    function setAlert(el, type, message) {
        if (!el) return;
        el.textContent = message;
        el.className = `form-alert ${type}`;
    }

    function updateMetaTags(data) {
        // Update Open Graph and Twitter meta tags for social sharing
        const url = window.location.href.split('?')[0] + '?id=' + data.id;
        const title = `${data.name} - Financial AI Championship Certificate`;
        const description = `Certificate of Participation for ${data.name} in the AI Financial Hackathon Championship, organized by LandingAI in collaboration with AWS.`;

        // Use personalized certificate image if available
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        const imageUrl = `${baseUrl}/assets/images/certificates/generated/${data.id}.png`;

        // Update og:url
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Update og:title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        // Update og:description
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        // Update og:image to personalized certificate
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', imageUrl);

        // Update twitter:url
        const twitterUrl = document.querySelector('meta[property="twitter:url"]');
        if (twitterUrl) twitterUrl.setAttribute('content', url);

        // Update twitter:title
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);

        // Update twitter:description
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', description);

        // Update twitter:image to personalized certificate
        const twitterImage = document.querySelector('meta[property="twitter:image"]');
        if (twitterImage) twitterImage.setAttribute('content', imageUrl);

        // Update page title
        document.title = title;
    }

    function renderCertificate(target, data) {
        if (!target) return;
        if (!data) {
            target.innerHTML = `<div class="placeholder">No certificate to display yet.</div>`;
            if (displayWrapper) displayWrapper.style.display = 'none';
            return;
        }
        target.innerHTML = `
            <div class="certificate-card">
                ${data.photo ? `<div class="certificate-photo"><img src="${data.photo}" alt="${data.name} headshot"></div>` : ''}
                <div class="certificate-name-box">
                    <div class="certificate-name">${data.name}</div>
                </div>
                <div class="certificate-date-box">
                    <div class="certificate-date">December 5, 2025</div>
                </div>
                <div class="certificate-id-box">
                    <div class="certificate-id">${data.id}</div>
                </div>
            </div>
        `;

        // Update additional elements
        if (displayWrapper) displayWrapper.style.display = 'block';
        if (credentialIdLink) {
            credentialIdLink.href = window.location.href.split('?')[0] + '?id=' + data.id;
        }
        if (credentialIdText) {
            credentialIdText.textContent = data.id;
        }
        if (issuedToName) issuedToName.textContent = data.name;

        // Update meta tags for social sharing
        updateMetaTags(data);
    }

    function normalizeId(input) {
        return (input || '').trim().toUpperCase();
    }

    function findCertificateById(id) {
        const lookupId = normalizeId(id);
        return certificates.find(c => normalizeId(c.id) === lookupId);
    }

    // Make sure all inline images/backgrounds are loaded before capturing
    function waitForImages(root) {
        if (!root) return Promise.resolve();

        const imgPromises = Array.from(root.querySelectorAll('img'))
            .filter(img => !img.complete || img.naturalWidth === 0)
            .map(img => new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            }));

        const bgPromises = [];
        root.querySelectorAll('*').forEach(el => {
            const bg = window.getComputedStyle(el).backgroundImage;
            const match = bg && bg !== 'none' ? bg.match(/url\(["']?([^"')]+)["']?\)/) : null;
            if (match && match[1]) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                const promise = new Promise((resolve) => {
                    img.onload = img.onerror = resolve;
                });
                bgPromises.push(promise);
                img.src = match[1];
            }
        });

        return Promise.all([...imgPromises, ...bgPromises]);
    }

    function handleLookupSubmit(e) {
        e.preventDefault();
        const id = lookupInput.value;
        if (!id) return;
        if (!certificates.length) {
            setAlert(lookupAlert, 'error', 'Certificates are still loading. Please try again.');
            return;
        }
        const match = findCertificateById(id);
        if (!match) {
            setAlert(lookupAlert, 'error', `No certificate found for ID "${id}". Check your code and try again.`);
            renderCertificate(renderTarget, null);
            return;
        }
        renderCertificate(renderTarget, match);
        setAlert(lookupAlert, 'success', `Verified! Certificate for ${match.name} is ready.`);

        // Scroll to certificate display
        if (displayWrapper) {
            setTimeout(() => {
                displayWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Helper function to generate shareable certificate URL
    function getCertificateShareUrl(certId) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        return `${baseUrl}/cert/${certId}.html`;
    }

    // Share functionality - Open modal
    function handleShareAward() {
        const modal = document.getElementById('shareModal');
        const shareUrlInput = document.getElementById('shareUrl');
        const url = getCertificateShareUrl(lookupInput.value);

        if (shareUrlInput) {
            shareUrlInput.value = url;
        }

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Close share modal
    function closeShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Share on LinkedIn
    function shareOnLinkedIn() {
        const url = getCertificateShareUrl(lookupInput.value);
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank');
    }

    // Share on X (Twitter)
    function shareOnTwitter() {
        const url = getCertificateShareUrl(lookupInput.value);
        const text = 'Check out my Financial AI Championship certificate! 🎓';
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    }

    // Copy link to clipboard
    function copyShareLink() {
        const shareUrlInput = document.getElementById('shareUrl');
        if (shareUrlInput) {
            shareUrlInput.select();
            navigator.clipboard.writeText(shareUrlInput.value).then(() => {
                // Visual feedback
                const btn = document.getElementById('shareCopyLink') || document.getElementById('copyUrlBtn');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                }
            }).catch(err => {
                alert('Failed to copy link. Please try manually.');
            });
        }
    }

    // LinkedIn integration
    async function handleAddToLinkedIn() {
        const certId = lookupInput.value;
        const url = getCertificateShareUrl(certId);
        const certFrame = document.getElementById('certificate-full-frame');
        const overlay = document.querySelector('.certificate-actions-overlay');

        // First, let's capture and share the certificate image
        if (certFrame && window.html2canvas) {
            try {
                // Hide overlay before capturing
                if (overlay) overlay.style.display = 'none';

                // Capture the certificate
                const canvas = await html2canvas(certFrame, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                });

                // Show overlay again
                if (overlay) overlay.style.display = '';

                // Convert to blob
                canvas.toBlob((blob) => {
                    // For now, we'll open LinkedIn certification page
                    // In a full implementation, you'd upload the image first
                    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Financial%20AI%20Championship%20Participant&organizationName=LandingAI&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(url)}&certId=${encodeURIComponent(certId)}`;
                    window.open(linkedInUrl, '_blank');
                });
            } catch (err) {
                console.error('Failed to capture certificate:', err);
                if (overlay) overlay.style.display = '';
                // Fallback to regular LinkedIn link
                const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Financial%20AI%20Championship%20Participant&organizationName=LandingAI&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(url)}&certId=${encodeURIComponent(certId)}`;
                window.open(linkedInUrl, '_blank');
            }
        } else {
            // Fallback if html2canvas not available
            const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Financial%20AI%20Championship%20Participant&organizationName=LandingAI&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(url)}&certId=${encodeURIComponent(certId)}`;
            window.open(linkedInUrl, '_blank');
        }
    }

    // Download certificate - capture exactly as displayed on screen
    const CERT_IMG_WIDTH = 2441;
    const CERT_IMG_HEIGHT = 1768;

    async function handleDownload() {
        const certCard = document.querySelector('.certificate-card');
        const overlay = document.querySelector('.certificate-actions-overlay');

        if (!certCard) {
            alert('Certificate not found');
            return;
        }

        try {
            // Hide overlay before capturing
            if (overlay) overlay.style.display = 'none';

            // Capture the certificate card directly at native resolution
            const target = certCard;
            const cleanup = [];

            function setTempStyle(el, props) {
                const prev = {};
                Object.keys(props).forEach(key => {
                    prev[key] = el.style[key];
                    el.style[key] = props[key];
                });
                cleanup.push({ el, prev });
            }

            // Set certificate to exact native dimensions for high-res capture
            setTempStyle(target, {
                width: `${CERT_IMG_WIDTH}px`,
                height: `${CERT_IMG_HEIGHT}px`,
                maxWidth: 'none',
                boxShadow: 'none',
                borderRadius: '0'
            });

            // Fix text sizes and positioning for native resolution (at 2441px width)
            const nameEl = target.querySelector('.certificate-name');
            const dateEl = target.querySelector('.certificate-date');
            const idEl = target.querySelector('.certificate-id');
            const nameBox = target.querySelector('.certificate-name-box');
            const dateBox = target.querySelector('.certificate-date-box');
            const idBox = target.querySelector('.certificate-id-box');

            if (nameEl) {
                setTempStyle(nameEl, {
                    fontSize: '48px',  // Increased to match preview better
                    lineHeight: '1.2'
                });
            }
            if (dateEl) {
                setTempStyle(dateEl, {
                    fontSize: '29px',  // ~1.2% of 2441px
                    lineHeight: '1.2'
                });
            }
            if (idEl) {
                setTempStyle(idEl, {
                    fontSize: '29px',  // ~1.2% of 2441px
                    lineHeight: '1.2'
                });
            }
            if (nameBox) {
                setTempStyle(nameBox, {
                    top: '59.1%',
                    left: '15.3%',
                    paddingLeft: '22px',  // 0.9rem scaled to native
                    paddingBottom: '2.4px'  // 0.1rem scaled to native
                });
            }
            if (dateBox) {
                setTempStyle(dateBox, {
                    top: '82%',
                    left: '7%'
                });
            }
            if (idBox) {
                setTempStyle(idBox, {
                    top: '91%',
                    right: '10%'
                });
            }

            // Wait for DOM, fonts, and images to settle before capture
            await new Promise(resolve => setTimeout(resolve, 100));
            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }
            await waitForImages(target);

            // Capture the certificate at native resolution
            const canvas = await html2canvas(target, {
                width: CERT_IMG_WIDTH,
                height: CERT_IMG_HEIGHT,
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                imageTimeout: 0,
                removeContainer: true,
                windowWidth: CERT_IMG_WIDTH,
                windowHeight: CERT_IMG_HEIGHT,
                scrollX: 0,
                scrollY: 0,
                foreignObjectRendering: false
            });

            // Restore styles
            cleanup.forEach(({ el, prev }) => {
                Object.keys(prev).forEach(key => {
                    el.style[key] = prev[key];
                });
            });

            // Show overlay again
            if (overlay) overlay.style.display = '';

            // Convert to blob and download with maximum quality
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `certificate-${lookupInput.value}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }, 'image/png', 1.0);
        } catch (err) {
            console.error('Download failed:', err);
            if (overlay) overlay.style.display = '';
            alert('Failed to download certificate. Please try taking a screenshot instead.');
        }
    }

    // Copy certificate link
    function handleCopyLink() {
        const url = getCertificateShareUrl(lookupInput.value);
        navigator.clipboard.writeText(url).then(() => {
            alert('Certificate link copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy link. Please try again.');
        });
    }

    function init() {
        renderCertificate(renderTarget, null);
        loadCertificates();

        if (lookupForm) {
            lookupForm.addEventListener('submit', handleLookupSubmit);
        }

        // Add event listeners for action buttons
        const shareBtn = document.getElementById('share-award-btn');
        const linkedInBtn = document.getElementById('add-to-linkedin-btn');
        const downloadBtn = document.getElementById('download-btn');
        const copyLinkBtn = document.getElementById('copy-link-btn');

        if (shareBtn) shareBtn.addEventListener('click', handleShareAward);
        if (linkedInBtn) linkedInBtn.addEventListener('click', handleAddToLinkedIn);
        if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
        if (copyLinkBtn) copyLinkBtn.addEventListener('click', handleCopyLink);

        // Add event listeners for overlay buttons
        const shareOverlayBtn = document.getElementById('share-award-overlay-btn');
        const linkedInOverlayBtn = document.getElementById('linkedin-overlay-btn');
        const downloadOverlayBtn = document.getElementById('download-overlay-btn');

        if (shareOverlayBtn) shareOverlayBtn.addEventListener('click', handleShareAward);
        if (linkedInOverlayBtn) linkedInOverlayBtn.addEventListener('click', handleAddToLinkedIn);
        if (downloadOverlayBtn) downloadOverlayBtn.addEventListener('click', handleDownload);

        // Add event listeners for share modal
        const closeModalBtn = document.getElementById('closeShareModal');
        const shareModalOverlay = document.querySelector('.share-modal-overlay');
        const shareLinkedInBtn = document.getElementById('shareLinkedIn');
        const shareTwitterBtn = document.getElementById('shareTwitter');
        const shareCopyLinkBtn = document.getElementById('shareCopyLink');
        const copyUrlBtn = document.getElementById('copyUrlBtn');

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeShareModal);
        if (shareModalOverlay) shareModalOverlay.addEventListener('click', closeShareModal);
        if (shareLinkedInBtn) shareLinkedInBtn.addEventListener('click', shareOnLinkedIn);
        if (shareTwitterBtn) shareTwitterBtn.addEventListener('click', shareOnTwitter);
        if (shareCopyLinkBtn) shareCopyLinkBtn.addEventListener('click', copyShareLink);
        if (copyUrlBtn) copyUrlBtn.addEventListener('click', copyShareLink);

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeShareModal();
            }
        });

        // Check for certificate ID in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const certId = urlParams.get('id');
        if (certId) {
            lookupInput.value = certId;
            // Wait for certificates to load, then auto-verify
            const checkInterval = setInterval(() => {
                if (certificates.length > 0) {
                    clearInterval(checkInterval);
                    lookupForm.dispatchEvent(new Event('submit'));
                }
            }, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
