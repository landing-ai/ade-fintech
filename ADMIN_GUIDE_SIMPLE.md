# 🎯 Simple Certificate Admin Guide

This is the simplified guide for managing certificates using the web-based admin panel.

## 🔑 Quick Start

### 1. Open the Admin Panel

Visit: `http://localhost:8080/admin.html` (or your deployment URL)

### 2. Login

- **Default Admin Key**: `admin123`
- **⚠️ IMPORTANT**: Change this in `admin.html` line 219 before deploying!

### 3. Manage Certificates

The admin panel lets you:
- ✅ View all certificates in a searchable table
- ➕ Add new certificates
- ✏️ Edit existing certificates
- 🗑️ Delete certificates
- 💾 Save & encrypt automatically
- 🔄 Refresh from server

---

## 📝 Common Tasks

### Adding a New Certificate

1. Click **"➕ Add Certificate"**
2. Fill in the form:
   - **Name**: Full name of the participant
   - **Email**: Email address
   - **Role**: Position/designation (default: "Participant")
3. The Certificate ID is auto-generated based on name + email
4. Click **"Save Certificate"**
5. Remember to click **"💾 Save & Encrypt"** to finalize!

### Editing a Certificate

1. Find the certificate in the table
2. Click **"Edit"** button
3. Update the details
4. Click **"Save Certificate"**
5. Remember to click **"💾 Save & Encrypt"** to finalize!

### Deleting a Certificate

1. Find the certificate in the table
2. Click **"Delete"** button
3. Confirm the deletion
4. Remember to click **"💾 Save & Encrypt"** to finalize!

### Searching for Certificates

Use the search box in the toolbar to filter by:
- Name
- Email
- Certificate ID

---

## 💾 Saving Your Changes

### Step 1: Save & Encrypt

1. Click **"💾 Save & Encrypt"** button
2. Confirm the action
3. The encrypted file will download automatically as `certificate_list.enc`

### Step 2: Replace the Old File

1. Move the downloaded `certificate_list.enc` to `data/` folder
2. Replace the existing file

### Step 3: Commit to GitHub

**Option A - Using the Helper Script (Recommended)**:
```bash
./scripts/update-certificates.sh
```
The script will:
- Check the file exists
- Show git status
- Prompt for commit message
- Commit the changes
- Ask if you want to push to GitHub

**Option B - Manual Git Commands**:
```bash
git add data/certificate_list.enc
git commit -m "Update certificates - $(date '+%Y-%m-%d')"
git push
```

---

## 🔐 Security

### Changing the Admin Key

1. Open `admin.html` in a code editor
2. Find line 219: `const ADMIN_KEY_HASH = 'admin123';`
3. Replace `'admin123'` with your secure password
4. Save the file

### Protecting the Admin Panel

**For Production**:
- Use a strong, unique admin key
- Consider adding IP restrictions via server config
- Use HTTPS for your domain
- Don't share the admin key with anyone

### The Encryption Key

The encryption key is stored in `assets/js/crypto-utils.js` (line 9).

**⚠️ IMPORTANT**:
- Never commit a plain CSV file to GitHub
- Keep the encryption key secret
- The same key must be used for encryption and decryption

---

## 📊 Understanding Certificate IDs

Certificate IDs are automatically generated using a deterministic hash:
- Format: `ADE-XXXX-XXXX`
- Based on: Name + Email (lowercase, trimmed)
- Same person always gets the same ID
- IDs cannot be manually changed

**Example**:
- Name: "John Doe"
- Email: "john@example.com"
- ID: `ADE-53D8-55B8`

---

## 🛠️ Troubleshooting

### "Failed to load certificates"

**Cause**: Encryption key mismatch or corrupted file

**Solution**:
1. Check that `data/certificate_list.enc` exists
2. Verify the encryption key in `crypto-utils.js` is correct
3. Try refreshing the page

### "Failed to encrypt certificates"

**Cause**: Browser doesn't support Web Crypto API or encryption key issue

**Solution**:
1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Ensure you're accessing via HTTPS or localhost
3. Check browser console for detailed errors

### Changes not appearing on website

**Cause**: Old encrypted file still in use

**Solution**:
1. Make sure you saved from the admin panel
2. Check you replaced the file in `data/certificate_list.enc`
3. Clear browser cache or do a hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
4. Verify changes were pushed to GitHub (if using GitHub Pages)

### "Invalid admin key"

**Cause**: Wrong password

**Solution**:
1. Check the admin key in `admin.html` line 219
2. Make sure you're using the correct password
3. Password is case-sensitive

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change the admin key from default `admin123`
- [ ] Verify encryption key is set and secure
- [ ] Test certificate verification on the public site
- [ ] Ensure `data/certificate_list.csv` is in `.gitignore`
- [ ] Confirm only `.enc` file is in the repository
- [ ] Set up branch protection on GitHub (optional)
- [ ] Test the admin panel works on your domain

---

## 📞 Need Help?

If you encounter issues:

1. Check the browser console for error messages (F12)
2. Verify all files are in the correct locations
3. Make sure encryption keys match between files
4. Review the troubleshooting section above

---

## 📁 File Reference

**Important Files**:
- `admin.html` - Admin panel interface (you'll use this!)
- `assets/js/crypto-utils.js` - Encryption/decryption (contains secret key)
- `data/certificate_list.enc` - Encrypted certificates (safe to commit)
- `data/certificate_list.csv` - Plain CSV (NEVER commit this!)
- `scripts/update-certificates.sh` - Git helper script

**Workflow**:
```
You edit via Admin Panel
    ↓
Save & Encrypt (downloads .enc file)
    ↓
Replace data/certificate_list.enc
    ↓
Run ./scripts/update-certificates.sh
    ↓
Push to GitHub
    ↓
Live on website! ✨
```

---

## ✨ Tips

- **Backup**: Keep a local copy of the plain CSV as backup (don't commit it!)
- **Testing**: Test new certificates locally before pushing to production
- **Bulk Add**: For adding many certificates at once, edit the CSV in Excel/Numbers, then encrypt
- **Regular Saves**: Click "Save & Encrypt" regularly to avoid losing work

---

**Last Updated**: December 2025
**Version**: 2.0 - Simplified Web-Based Workflow
