// ========================================
// Certificate verification
// ========================================
(function() {
    'use strict';

    const csvPath = 'data/certificate_list.csv';
    const lookupForm = document.getElementById('certificate-lookup-form');
    const lookupInput = document.getElementById('certificate-id');
    const lookupAlert = document.getElementById('lookup-alert');
    const previewSubtitle = document.getElementById('certificate-preview-subtitle');
    const renderTarget = document.getElementById('certificate-render');

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
            const res = await fetch(`${csvPath}?v=${Date.now()}`);
            const text = await res.text();
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

    function renderCertificate(target, data) {
        if (!target) return;
        if (!data) {
            target.innerHTML = `<div class="placeholder">No certificate to display yet.</div>`;
            return;
        }
        target.innerHTML = `
            <div class="certificate-card">
                ${data.photo ? `<div class="certificate-photo"><img src="${data.photo}" alt="${data.name} headshot"></div>` : ''}
                <div class="certificate-overlay">
                    <div class="certificate-title">Financial AI Championship</div>
                    <div class="certificate-name">${data.name}</div>
                    <div class="certificate-role">${data.role || 'Participant'}</div>
                    <div class="certificate-email">${data.email}</div>
                    <div class="certificate-id">Certificate ID: ${data.id}</div>
                </div>
            </div>
        `;
    }

    function normalizeId(input) {
        return (input || '').trim().toUpperCase();
    }

    function findCertificateById(id) {
        const lookupId = normalizeId(id);
        return certificates.find(c => normalizeId(c.id) === lookupId);
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
        previewSubtitle.textContent = 'Verified certificate';
        setAlert(lookupAlert, 'success', `Verified! Certificate for ${match.name} is ready.`);
    }

    function init() {
        renderCertificate(renderTarget, null);
        loadCertificates();

        if (lookupForm) {
            lookupForm.addEventListener('submit', handleLookupSubmit);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
