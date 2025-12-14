// ========================================
// Certificate verification
// ========================================
(function() {
    'use strict';

    const lookupForm = document.getElementById('certificate-lookup-form');
    const lookupInput = document.getElementById('certificate-id');
    const lookupAlert = document.getElementById('lookup-alert');
    const renderTarget = document.getElementById('certificate-render');
    const displayWrapper = document.getElementById('certificate-display-wrapper');
    const credentialIdLink = document.getElementById('certificate-credential-id');
    const credentialIdText = document.getElementById('credential-id-text');
    const issuedToName = document.getElementById('issued-to-name');

    function setAlert(el, type, message) {
        if (!el) return;
        el.textContent = message;
        el.className = `form-alert ${type}`;
    }

    function updateMetaTags(data) {
        // Update Open Graph and Twitter meta tags for social sharing
        const url = window.location.href.split('?')[0] + '?id=' + data.id;
        const title = `${data.recipient_name} - Financial AI Championship Certificate`;
        const description = `Certificate of Participation for ${data.recipient_name} in the AI Financial Hackathon Championship, organized by LandingAI in collaboration with AWS.`;

        // Use personalized certificate image if available (Assuming generated images are still static or generated on fly)
        // For now, pointing to a placeholder or assuming the backend might serve it in future.
        // Reverting to the existing logic for image path based on ID.
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        const imageUrl = `${baseUrl}/assets/images/certificates/generated/${data.id}.png`;

        const metas = [
            { prop: 'og:url', content: url },
            { prop: 'og:title', content: title },
            { prop: 'og:description', content: description },
            { prop: 'og:image', content: imageUrl },
            { prop: 'twitter:url', content: url },
            { prop: 'twitter:title', content: title },
            { prop: 'twitter:description', content: description },
            { prop: 'twitter:image', content: imageUrl }
        ];

        metas.forEach(meta => {
            const el = document.querySelector(`meta[property="${meta.prop}"]`);
            if (el) el.setAttribute('content', meta.content);
        });

        document.title = title;
    }

    function renderCertificate(target, data) {
        if (!target) return;
        if (!data) {
            target.innerHTML = `<div class="placeholder">No certificate to display yet.</div>`;
            if (displayWrapper) displayWrapper.style.display = 'none';
            return;
        }
        
        // Format date nicely
        const dateStr = new Date(data.issue_date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        target.innerHTML = `
            <div class="certificate-card">
                ${data.photo ? `<div class="certificate-photo"><img src="${data.photo}" alt="${data.recipient_name} headshot"></div>` : ''}
                <div class="certificate-name-box">
                    <div class="certificate-name">${data.recipient_name}</div>
                </div>
                <div class="certificate-date-box">
                    <div class="certificate-date">${dateStr}</div>
                </div>
                <div class="certificate-id-box">
                    <div class="certificate-id">${data.id}</div>
                </div>
            </div>
        `;

        if (displayWrapper) displayWrapper.style.display = 'block';
        if (credentialIdLink) {
            credentialIdLink.href = window.location.href.split('?')[0] + '?id=' + data.id;
        }
        if (credentialIdText) {
            credentialIdText.textContent = data.id;
        }
        if (issuedToName) issuedToName.textContent = data.recipient_name;

        updateMetaTags(data);
    }

    async function handleLookupSubmit(e) {
        if(e) e.preventDefault();
        
        const id = lookupInput.value.trim();
        if (!id) return;

        setAlert(lookupAlert, '', 'Verifying...');

        try {
            const cert = await window.ApiService.verifyCertificate(id);
            
            if (!cert) {
                setAlert(lookupAlert, 'error', `No certificate found for ID "${id}". Check your code and try again.`);
                renderCertificate(renderTarget, null);
                return;
            }

            renderCertificate(renderTarget, cert);
            setAlert(lookupAlert, 'success', `Verified! Certificate for ${cert.recipient_name} is ready.`);

            if (displayWrapper) {
                setTimeout(() => {
                    displayWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }

        } catch (error) {
            console.error(error);
            setAlert(lookupAlert, 'error', 'Service unavailable. Please try again later.');
        }
    }

    // Share & Download Helpers
    function getCertificateShareUrl(certId) {
        // Use the verify page URL
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        return `${baseUrl}/certificates.html?id=${certId}`;
    }

    function handleShareAward() {
        const modal = document.getElementById('shareModal');
        const shareUrlInput = document.getElementById('shareUrl');
        const url = getCertificateShareUrl(lookupInput.value);

        if (shareUrlInput) shareUrlInput.value = url;
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function shareOnLinkedIn() {
        const url = getCertificateShareUrl(lookupInput.value);
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank');
    }

    function shareOnTwitter() {
        const url = getCertificateShareUrl(lookupInput.value);
        const text = 'Check out my Financial AI Championship certificate! 🎓';
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    }

    function copyShareLink() {
        const shareUrlInput = document.getElementById('shareUrl');
        if (shareUrlInput) {
            shareUrlInput.select();
            navigator.clipboard.writeText(shareUrlInput.value).then(() => {
                const btn = document.getElementById('shareCopyLink') || document.getElementById('copyUrlBtn');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                }
            }).catch(err => alert('Failed to copy link.'));
        }
    }

    // Download functionality (kept mostly same, dependent on html2canvas)
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
            if (overlay) overlay.style.display = 'none';

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
                     fontSize: '48px',  
                     lineHeight: '1.2'
                 });
             }
             if (dateEl) {
                 setTempStyle(dateEl, {
                     fontSize: '29px',
                     lineHeight: '1.2'
                 });
             }
             if (idEl) {
                 setTempStyle(idEl, {
                     fontSize: '29px', 
                     lineHeight: '1.2'
                 });
             }
             if (nameBox) {
                 setTempStyle(nameBox, {
                     top: '59.1%',
                     left: '15.3%',
                     paddingLeft: '22px',  
                     paddingBottom: '2.4px' 
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

            // Wait for DOM
            await new Promise(resolve => setTimeout(resolve, 100));
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            
            // Assume waitForImages is global or simple enough to skip if images are already loaded
            // For robustness, simple wait
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(target, {
                width: CERT_IMG_WIDTH,
                height: CERT_IMG_HEIGHT,
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                imageTimeout: 0,
                removeContainer: true
            });

            cleanup.forEach(({ el, prev }) => {
                Object.keys(prev).forEach(key => el.style[key] = prev[key]);
            });

            if (overlay) overlay.style.display = '';

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
            alert('Failed to download certificate.');
        }
    }

    function handleCopyLink() {
        const url = getCertificateShareUrl(lookupInput.value);
        navigator.clipboard.writeText(url).then(() => {
            alert('Certificate link copied to clipboard!');
        }).catch(() => alert('Failed to copy link.'));
    }

    function init() {
        renderCertificate(renderTarget, null);

        if (lookupForm) {
            lookupForm.addEventListener('submit', handleLookupSubmit);
        }

        // Action Buttons
        const shareBtn = document.getElementById('share-award-btn');
        const downloadBtn = document.getElementById('download-btn');
        const copyLinkBtn = document.getElementById('copy-link-btn');
        if (shareBtn) shareBtn.addEventListener('click', handleShareAward);
        if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
        if (copyLinkBtn) copyLinkBtn.addEventListener('click', handleCopyLink);

        // Overlay Buttons
        const shareOverlayBtn = document.getElementById('share-award-overlay-btn');
        const downloadOverlayBtn = document.getElementById('download-overlay-btn');
        if (shareOverlayBtn) shareOverlayBtn.addEventListener('click', handleShareAward);
        if (downloadOverlayBtn) downloadOverlayBtn.addEventListener('click', handleDownload);

        // Modal
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeShareModal();
        });

        // Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const certId = urlParams.get('id');
        if (certId) {
            lookupInput.value = certId;
            // Immediate verify
            handleLookupSubmit(null);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();