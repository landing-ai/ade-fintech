# Quick Setup Guide: Encrypted Certificate System

## ✅ Setup Checklist

### 1. Security Configuration (5 minutes)

**Generate a strong encryption key:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Update encryption key in these files:**
- [ ] `scripts/encrypt-certificates.js` (Line 17)
- [ ] `assets/js/crypto-utils.js` (Line 8)

**Important:** Use the SAME key in both files!

### 2. Encrypt Certificate Data (2 minutes)

```bash
# Navigate to project directory
cd /path/to/ade-fintech

# Run encryption script
node scripts/encrypt-certificates.js

# Verify encrypted file was created
ls -lh data/certificate_list.enc
```

### 3. Configure GitHub Repository (10 minutes)

**A. Add .gitignore protection:**
```bash
# Verify .gitignore exists and contains:
cat .gitignore | grep certificate_list.csv
```

**B. Set up branch protection:**
1. Go to GitHub: `Settings` → `Branches`
2. Click "Add rule" for `main` branch
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Restrict who can push to matching branches
   - ✅ Add your admin username to allowed list

**C. Create CODEOWNERS file:**
```bash
mkdir -p .github
cat > .github/CODEOWNERS << 'EOF'
# Certificate data requires admin approval
/data/certificate_list.enc @your-github-username
/scripts/encrypt-certificates.js @your-github-username
/assets/js/crypto-utils.js @your-github-username
EOF
```

### 4. Initial Commit (3 minutes)

```bash
# Stage encrypted files
git add data/certificate_list.enc
git add scripts/
git add assets/js/crypto-utils.js
git add .gitignore
git add .github/CODEOWNERS

# Commit
git commit -m "Security: Add encrypted certificate system"

# Push to GitHub
git push origin main
```

### 5. Test Certificate Verification (2 minutes)

1. Visit: http://your-domain.com/certificates.html
2. Enter test certificate ID: `ADE-53D8-55B8`
3. Verify certificate loads and displays correctly
4. Check browser console for "Certificates decrypted successfully"

---

## 🔄 Daily Workflow

### When Adding New Certificates:

```bash
# 1. Edit plain CSV locally (NOT in Git)
nano data/certificate_list.csv

# 2. Encrypt
node scripts/encrypt-certificates.js

# 3. Commit only encrypted file
git add data/certificate_list.enc
git commit -m "Add certificates: [names or count]"
git push origin main

# 4. Verify on website
```

---

## 🚨 Emergency: If Plain CSV Gets Committed

**Act immediately:**

```bash
# Remove from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch data/certificate_list.csv" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (requires admin access)
git push origin --force --all

# Rotate encryption key immediately
# (Follow key rotation steps in ADMIN_CERTIFICATE_GUIDE.md)
```

---

## 📝 Files Created

- ✅ `scripts/encrypt-certificates.js` - Admin encryption tool
- ✅ `assets/js/crypto-utils.js` - Frontend decryption library
- ✅ `data/certificate_list.enc` - Encrypted certificate data
- ✅ `.gitignore` - Protects plain CSV from commits
- ✅ `ADMIN_CERTIFICATE_GUIDE.md` - Detailed admin documentation
- ✅ `.env.example` - Environment variable template

---

## 🎯 Verification Checklist

Before going live, verify:

- [ ] Encryption key is strong (32+ characters)
- [ ] Same key used in both JS files
- [ ] Plain CSV is in .gitignore
- [ ] GitHub branch protection enabled
- [ ] CODEOWNERS file configured
- [ ] Test certificate ID works on live site
- [ ] Browser console shows no errors
- [ ] Certificate displays correctly with all data

---

## 📚 Additional Resources

- Full Admin Guide: `ADMIN_CERTIFICATE_GUIDE.md`
- Sample Environment: `.env.example`
- Encryption Script: `scripts/encrypt-certificates.js`

---

## 🆘 Need Help?

**Common Issues:**

1. **"Decryption failed"** → Keys don't match between files
2. **"Could not load certificate records"** → File path incorrect
3. **"Crypto utilities not loaded"** → Check script load order in HTML

**Debug Mode:**

Set `useEncryption = false` in `assets/js/certificates.js` line 9 to test with plain CSV locally.

---

**Setup Time:** ~20 minutes
**Maintenance:** 2-5 minutes per update
**Security Level:** AES-256-GCM encryption
