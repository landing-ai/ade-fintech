#!/usr/bin/env node

/**
 * Certificate Image Generator - From Deployed Site
 *
 * This script generates individual certificate images for each participant
 * by accessing the deployed GitHub Pages site.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = 'https://landing-ai.github.io/ade-fintech/certificates.html';
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
        const url = `${BASE_URL}?id=${certificate.id}`;
        console.log(`  Loading: ${url}`);

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        // Wait for certificate to render
        await page.waitForSelector('.certificate-card', { timeout: 30000 });

        // Wait more for fonts and images to load
        await new Promise(resolve => setTimeout(resolve, 3000));

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
        return true;

    } catch (error) {
        console.error(`✗ Error generating certificate for ${certificate.name}:`, error.message);
        return false;
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
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Generate images for all certificates
        let successCount = 0;
        let errorCount = 0;

        for (const cert of certificates) {
            const success = await generateCertificateImage(browser, cert);
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        await browser.close();

        console.log(`\n✓ Successfully generated ${successCount} certificate images`);
        if (errorCount > 0) {
            console.log(`✗ Failed to generate ${errorCount} certificates`);
        }
        console.log(`Output directory: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
