#!/usr/bin/env node

/**
 * Certificate CSV Encryption Script
 * Admin-only script to encrypt certificate_list.csv before pushing to GitHub
 *
 * Usage: node scripts/encrypt-certificates.js
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const TAG_LENGTH = 16;

// IMPORTANT: Store this key securely!
// In production, use environment variables or a secure key management system
const ENCRYPTION_KEY = process.env.CERT_ENCRYPTION_KEY || 'your-secret-key-here-change-this-32-chars-long!!!';

// Ensure key is correct length
function getKey() {
    const key = Buffer.from(ENCRYPTION_KEY);
    if (key.length !== KEY_LENGTH) {
        // Hash the key to get exactly 32 bytes
        return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    }
    return key;
}

function encryptData(plaintext) {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Combine iv + tag + encrypted data
    const result = iv.toString('hex') + tag.toString('hex') + encrypted;

    return result;
}

function decryptData(encryptedHex) {
    const key = getKey();

    // Extract iv, tag, and encrypted data
    const iv = Buffer.from(encryptedHex.slice(0, IV_LENGTH * 2), 'hex');
    const tag = Buffer.from(encryptedHex.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), 'hex');
    const encrypted = encryptedHex.slice((IV_LENGTH + TAG_LENGTH) * 2);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

function main() {
    const inputFile = path.join(__dirname, '../data/certificate_list.csv');
    const outputFile = path.join(__dirname, '../data/certificate_list.enc');

    try {
        console.log('🔐 Certificate Encryption Tool\n');

        // Check if input file exists
        if (!fs.existsSync(inputFile)) {
            console.error(`❌ Error: Input file not found: ${inputFile}`);
            process.exit(1);
        }

        // Read the CSV file
        console.log(`📖 Reading: ${inputFile}`);
        const csvContent = fs.readFileSync(inputFile, 'utf8');

        // Encrypt the content
        console.log('🔒 Encrypting data...');
        const encrypted = encryptData(csvContent);

        // Write encrypted file
        console.log(`💾 Writing: ${outputFile}`);
        fs.writeFileSync(outputFile, encrypted, 'utf8');

        // Verify by decrypting
        console.log('✓ Verifying encryption...');
        const decrypted = decryptData(encrypted);

        if (decrypted === csvContent) {
            console.log('✅ Success! File encrypted and verified.');
            console.log(`\n📊 Stats:`);
            console.log(`   Original size: ${csvContent.length} bytes`);
            console.log(`   Encrypted size: ${encrypted.length} bytes`);
            console.log(`\n⚠️  Next steps:`);
            console.log(`   1. Commit ${outputFile} to GitHub`);
            console.log(`   2. DO NOT commit the original CSV file!`);
            console.log(`   3. Add certificate_list.csv to .gitignore`);
        } else {
            console.error('❌ Verification failed! Decrypted content does not match original.');
            process.exit(1);
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { encryptData, decryptData };
