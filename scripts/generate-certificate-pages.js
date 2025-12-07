#!/usr/bin/env node

/**
 * Certificate Page Generator
 *
 * Generates individual HTML pages for each certificate with proper meta tags
 * for social media sharing (since JavaScript meta tag updates don't work for crawlers)
 */

const fs = require('fs').promises;
const path = require('path');

const CSV_PATH = path.join(__dirname, '../data/certificate_list.csv');
const OUTPUT_DIR = path.join(__dirname, '../cert');
const TEMPLATE_PATH = path.join(__dirname, '../certificates.html');

// Parse CSV file
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
            return {
                name,
                email,
                id: generateCertId(name, email)
            };
        })
        .filter(entry => entry.name || entry.email);
}

// Generate certificate ID (same logic as frontend)
function generateCertId(name, email) {
    const input = `${(name || '').trim().toLowerCase()}|${(email || '').trim().toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
    return `ADE-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

function generateCertificatePage(certificate) {
    const certUrl = `https://landing-ai.github.io/ade-fintech/cert/${certificate.id}.html`;
    const imageUrl = `https://landing-ai.github.io/ade-fintech/assets/images/certificates/generated/${certificate.id}.png`;
    const title = certificate.name ? `${certificate.name} - Financial AI Championship Certificate` : 'Financial AI Championship Certificate';
    const description = certificate.name
        ? `Certificate of Participation for ${certificate.name} in the AI Financial Hackathon Championship, organized by LandingAI in collaboration with AWS.`
        : 'Certificate of Participation for the AI Financial Hackathon Championship, organized by LandingAI in collaboration with AWS.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${certUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="2441">
    <meta property="og:image:height" content="1768">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${certUrl}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${imageUrl}">

    <!-- Redirect to main certificate page with ID -->
    <script>
        // Redirect to the main certificate verification page with the ID parameter
        window.location.href = '../certificates.html?id=${certificate.id}';
    </script>

    <link rel="stylesheet" href="../assets/css/style.css?v=52">
    <link rel="stylesheet" href="../assets/css/matrix-theme.css?v=52">
</head>
<body>
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; background: #000; color: #00ff41;">
        <div style="text-align: center; padding: 2rem;">
            <h1 style="font-size: 2rem; margin-bottom: 1rem;">Redirecting to certificate...</h1>
            <p style="margin-bottom: 2rem;">If you're not redirected automatically, <a href="../certificates.html?id=${certificate.id}" style="color: #00ff41; text-decoration: underline;">click here</a>.</p>
            <div style="display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(0,255,65,0.3); border-top-color: #00ff41; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    </div>
    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</body>
</html>`;
}

async function main() {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Read and parse CSV
        console.log('Loading certificates from CSV...');
        const csvContent = await fs.readFile(CSV_PATH, 'utf-8');
        const certificates = parseCsv(csvContent);
        console.log(`Found ${certificates.length} certificates\n`);

        // Generate HTML pages for all certificates
        let count = 0;
        for (const cert of certificates) {
            const html = generateCertificatePage(cert);
            const outputPath = path.join(OUTPUT_DIR, `${cert.id}.html`);
            await fs.writeFile(outputPath, html, 'utf-8');
            console.log(`✓ Generated: ${cert.id}.html (${cert.name})`);
            count++;
        }

        console.log(`\n✓ Successfully generated ${count} certificate pages`);
        console.log(`Output directory: ${OUTPUT_DIR}`);
        console.log('\nThese pages will:');
        console.log('1. Show proper meta tags for social media previews');
        console.log('2. Redirect users to the main certificate page');
        console.log('3. Work with LinkedIn, Facebook, Twitter sharing');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
