# Admin Guide: Encrypted Certificate Management

This guide explains how to manage the encrypted certificate list for the Financial AI Championship certificate verification system.

## 🔐 Overview

The certificate system uses **AES-256-GCM encryption** to protect participant data stored in GitHub. Only administrators with the encryption key can decrypt and update the certificate list.

---

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Updating Certificates](#updating-certificates)
3. [Security Best Practices](#security-best-practices)
4. [GitHub Repository Protection](#github-repository-protection)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### 1. Set Up Encryption Key

**IMPORTANT:** Keep this key secret! Anyone with this key can decrypt the certificates.

```bash
# Set encryption key as environment variable (recommended)
export CERT_ENCRYPTION_KEY="your-strong-secret-key-min-32-chars-long"

# On Windows:
set CERT_ENCRYPTION_KEY=your-strong-secret-key-min-32-chars-long
```

**Alternative:** Edit the key directly in the scripts (not recommended for production):
- `/scripts/encrypt-certificates.js` - Line 17
- `/assets/js/crypto-utils.js` - Line 8

### 2. Install Node.js Dependencies

The encryption script requires Node.js (no additional packages needed, uses built-in crypto).

```bash
# Verify Node.js is installed
node --version

# Should be v14 or higher
```

### 3. Prepare .gitignore

Ensure the plain CSV file is NEVER committed to GitHub:

```bash
# Add to .gitignore
echo "data/certificate_list.csv" >> .gitignore
echo ".env" >> .gitignore
```

---

## 📝 Updating Certificates

### Step 1: Edit the CSV File Locally

Edit `data/certificate_list.csv` on your local machine:

```csv
Name,Email,Designation/Position
John Doe,john.doe@example.com,Lead Developer
Jane Smith,jane.smith@example.com,Data Scientist
```

**CSV Format:**
- Column 1: `Name` - Full name of participant
- Column 2: `Email` - Email address
- Column 3: `Designation/Position` - Job title/role

### Step 2: Encrypt the CSV File

Run the encryption script:

```bash
cd /path/to/ade-fintech
node scripts/encrypt-certificates.js
```

**Expected Output:**
```
🔐 Certificate Encryption Tool

📖 Reading: data/certificate_list.csv
🔒 Encrypting data...
💾 Writing: data/certificate_list.enc
✓ Verifying encryption...
✅ Success! File encrypted and verified.

📊 Stats:
   Original size: 4821 bytes
   Encrypted size: 6432 bytes

⚠️  Next steps:
   1. Commit data/certificate_list.enc to GitHub
   2. DO NOT commit the original CSV file!
   3. Add certificate_list.csv to .gitignore
```

### Step 3: Commit to GitHub

```bash
# Stage only the encrypted file
git add data/certificate_list.enc

# Commit with descriptive message
git commit -m "Update certificates: Added new participants"

# Push to GitHub
git push origin main
```

### Step 4: Verify Deployment

1. Visit your certificate verification page
2. Enter a test certificate ID
3. Verify the data loads correctly

---

## 🔒 Security Best Practices

### 1. Encryption Key Management

**DO:**
- ✅ Use environment variables for the encryption key
- ✅ Use a strong, random 32+ character key
- ✅ Store the key in a password manager
- ✅ Rotate keys periodically (requires re-encryption)

**DON'T:**
- ❌ Commit the encryption key to GitHub
- ❌ Share the key via email or Slack
- ❌ Use weak or predictable keys
- ❌ Store the key in plain text files

### 2. Access Control

- Only grant encryption key to authorized admins
- Use GitHub branch protection rules (see below)
- Monitor GitHub access logs regularly
- Revoke access when team members leave

### 3. Backup Strategy

```bash
# Create encrypted backup with timestamp
cp data/certificate_list.enc "backups/certificates_$(date +%Y%m%d).enc"

# Keep original CSV in secure location (not in Git)
cp data/certificate_list.csv "/secure/path/certificates_$(date +%Y%m%d).csv"
```

---

## 🛡️ GitHub Repository Protection

### Branch Protection Rules

Protect the `main` branch to ensure only admins can push encrypted certificates:

1. **Go to GitHub Repository Settings**
   - Navigate to: `Settings` → `Branches`

2. **Add Branch Protection Rule**
   - Branch name pattern: `main`

3. **Enable These Settings:**
   - ✅ Require pull request reviews before merging
   - ✅ Require review from Code Owners
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators (optional, for safety)
   - ✅ Restrict who can push to matching branches

4. **Add Allowed Pushers**
   - Add only admin GitHub usernames
   - Remove when access should be revoked

### CODEOWNERS File

Create `.github/CODEOWNERS`:

```
# Certificate data requires admin approval
/data/certificate_list.enc @your-github-username
/scripts/encrypt-certificates.js @your-github-username
/assets/js/crypto-utils.js @your-github-username
```

---

## 🔧 Troubleshooting

### Issue: "Decryption failed" Error

**Cause:** Encryption key mismatch between encryption script and frontend.

**Solution:**
```bash
# Verify keys match
grep "ENCRYPTION_KEY" scripts/encrypt-certificates.js
grep "ENCRYPTION_KEY" assets/js/crypto-utils.js

# Re-encrypt with correct key
export CERT_ENCRYPTION_KEY="correct-key-here"
node scripts/encrypt-certificates.js
```

### Issue: "Could not load certificate records"

**Cause:** Encrypted file not found or network error.

**Solution:**
1. Verify `data/certificate_list.enc` exists
2. Check browser console for detailed errors
3. Ensure file is committed to GitHub
4. Clear browser cache and reload

### Issue: Certificate ID Not Found

**Cause:** Certificate data might be cached or CSV format incorrect.

**Solution:**
```bash
# Verify CSV format is correct
head -5 data/certificate_list.csv

# Should show:
# Name,Email,Designation/Position
# John Doe,john.doe@example.com,Lead Developer
```

### Issue: Encryption Script Fails

**Cause:** Node.js version or file permissions.

**Solution:**
```bash
# Check Node.js version (need v14+)
node --version

# Check file permissions
ls -la data/certificate_list.csv

# Make script executable
chmod +x scripts/encrypt-certificates.js
```

---

## 🎯 Quick Reference Commands

```bash
# Encrypt certificates
node scripts/encrypt-certificates.js

# Test decryption locally (requires Node.js script)
node -e "const {decryptData} = require('./scripts/encrypt-certificates'); \
const fs = require('fs'); \
const enc = fs.readFileSync('data/certificate_list.enc', 'utf8'); \
console.log(decryptData(enc));"

# Commit encrypted file
git add data/certificate_list.enc
git commit -m "Update certificates"
git push origin main

# Create backup
cp data/certificate_list.enc "backups/cert_$(date +%Y%m%d).enc"
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for detailed errors
3. Verify encryption keys match in all files
4. Contact the development team

---

## 🔄 Rotating Encryption Keys

If you need to change the encryption key:

1. Update the key in both files:
   - `scripts/encrypt-certificates.js`
   - `assets/js/crypto-utils.js`

2. Re-encrypt the certificate list:
   ```bash
   export CERT_ENCRYPTION_KEY="new-key-here"
   node scripts/encrypt-certificates.js
   ```

3. Commit and deploy:
   ```bash
   git add data/certificate_list.enc
   git add assets/js/crypto-utils.js
   git commit -m "Security: Rotate encryption key"
   git push origin main
   ```

4. Deploy the updated frontend immediately

---

**Last Updated:** December 2025
**Maintained by:** Admin Team
