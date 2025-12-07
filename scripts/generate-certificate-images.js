#!/usr/bin/env node

/**
 * Certificate Image Generator
 *
 * This script generates individual certificate images for each participant
 * that can be used for social media sharing previews.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:8000/certificates.html';
const OUTPUT_DIR = path.join(__dirname, '../assets/images/certificates/generated');
const CSV_PATH = path.join(__dirname, '../data/certificate_list.csv');

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

async function generateCertificateImage(browser, certificate) {
    console.log(`Generating certificate for ${certificate.name} (${certificate.id})...`);

    const page = await browser.newPage();

    try {
        // Set viewport to certificate dimensions
        await page.setViewport({
            width: 2441,
            height: 1768,
            deviceScaleFactor: 1
        });

        // Navigate to certificate page with ID
        await page.goto(`${BASE_URL}?id=${certificate.id}`, {
            waitUntil: 'networkidle0'
        });

        // Wait for certificate to render
        await page.waitForSelector('.certificate-card', { timeout: 10000 });

        // Wait a bit more for fonts and images to load
        await page.waitForTimeout(2000);

        // Get the certificate card element
        const element = await page.$('.certificate-card');

        if (!element) {
            throw new Error('Certificate card not found');
        }

        // Take screenshot of the certificate
        const screenshot = await element.screenshot({
            type: 'png',
            omitBackground: false
        });

        // Save to file
        const outputPath = path.join(OUTPUT_DIR, `${certificate.id}.png`);
        await fs.writeFile(outputPath, screenshot);

        console.log(`✓ Saved: ${outputPath}`);

    } catch (error) {
        console.error(`✗ Error generating certificate for ${certificate.name}:`, error.message);
    } finally {
        await page.close();
    }
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

        // Launch browser
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new'
        });

        // Generate images for all certificates
        for (const cert of certificates) {
            await generateCertificateImage(browser, cert);
        }

        await browser.close();

        console.log(`\n✓ Generated ${certificates.length} certificate images`);
        console.log(`Output directory: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
