// Certificate Decryption Utilities
// Uses Web Crypto API for client-side decryption

(function(window) {
    'use strict';

    // IMPORTANT: This key must match the encryption key used in encrypt-certificates.js
    // Store this securely or use environment-specific builds
    const ENCRYPTION_KEY = 'your-secret-key-here-change-this-32-chars-long!!!';

    const ALGORITHM = 'AES-GCM';
    const IV_LENGTH = 16;
    const TAG_LENGTH = 16;

    /**
     * Convert hex string to Uint8Array
     */
    function hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    /**
     * Convert Uint8Array to hex string
     */
    function bytesToHex(bytes) {
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Get encryption key as CryptoKey
     * @param {boolean} forEncryption - Whether the key is for encryption (vs decryption)
     */
    async function getKey(forEncryption = false) {
        // Hash the key to get exactly 32 bytes
        const encoder = new TextEncoder();
        const keyData = encoder.encode(ENCRYPTION_KEY);

        const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

        return crypto.subtle.importKey(
            'raw',
            hashBuffer,
            { name: ALGORITHM },
            false,
            forEncryption ? ['encrypt'] : ['decrypt']
        );
    }

    /**
     * Decrypt encrypted hex string
     * @param {string} encryptedHex - Hex string containing IV + tag + encrypted data
     * @returns {Promise<string>} - Decrypted plaintext
     */
    async function decryptData(encryptedHex) {
        try {
            // Extract components
            const ivHex = encryptedHex.slice(0, IV_LENGTH * 2);
            const tagHex = encryptedHex.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2);
            const encryptedDataHex = encryptedHex.slice((IV_LENGTH + TAG_LENGTH) * 2);

            // Convert to bytes
            const iv = hexToBytes(ivHex);
            const tag = hexToBytes(tagHex);
            const encryptedData = hexToBytes(encryptedDataHex);

            // Combine encrypted data and tag
            const combinedData = new Uint8Array(encryptedData.length + tag.length);
            combinedData.set(encryptedData, 0);
            combinedData.set(tag, encryptedData.length);

            // Get key
            const key = await getKey();

            // Decrypt
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: ALGORITHM,
                    iv: iv
                },
                key,
                combinedData
            );

            // Convert to string
            const decoder = new TextDecoder();
            return decoder.decode(decryptedBuffer);

        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Failed to decrypt certificate data');
        }
    }

    /**
     * Encrypt plaintext data
     * @param {string} plaintext - Data to encrypt
     * @returns {Promise<string>} - Hex string containing IV + tag + encrypted data
     */
    async function encryptData(plaintext) {
        try {
            // Generate random IV
            const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

            // Convert plaintext to bytes
            const encoder = new TextEncoder();
            const plaintextBytes = encoder.encode(plaintext);

            // Get encryption key
            const key = await getKey(true);

            // Encrypt
            const encryptedBuffer = await crypto.subtle.encrypt(
                {
                    name: ALGORITHM,
                    iv: iv
                },
                key,
                plaintextBytes
            );

            // Split encrypted data and tag
            const encryptedBytes = new Uint8Array(encryptedBuffer);
            const encryptedData = encryptedBytes.slice(0, encryptedBytes.length - TAG_LENGTH);
            const tag = encryptedBytes.slice(encryptedBytes.length - TAG_LENGTH);

            // Combine IV + tag + encrypted data as hex
            return bytesToHex(iv) + bytesToHex(tag) + bytesToHex(encryptedData);

        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt certificate data');
        }
    }

    /**
     * Fetch and decrypt certificate file
     * @param {string} url - URL to encrypted file
     * @returns {Promise<string>} - Decrypted CSV content
     */
    async function fetchAndDecrypt(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const encryptedData = await response.text();
            const decryptedData = await decryptData(encryptedData);

            return decryptedData;

        } catch (error) {
            console.error('Failed to fetch and decrypt:', error);
            throw error;
        }
    }

    // Export to global scope
    window.CertCrypto = {
        encryptData,
        decryptData,
        fetchAndDecrypt
    };

})(window);
