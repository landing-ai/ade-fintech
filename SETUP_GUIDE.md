# Setup Guide - Adding Media to the Website

This guide will help you add YouTube videos and photos to the website.

---

## 📹 Adding YouTube Playlist

### Step 1: Get Your Playlist ID

1. Go to your YouTube playlist
2. Copy the playlist URL (looks like: `https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxx`)
3. Extract the playlist ID (the part after `list=`)

### Step 2: Update the Website

1. Open `assets/js/main.js`
2. Find line 109: `const YOUTUBE_PLAYLIST_ID = 'YOUR_PLAYLIST_ID_HERE';`
3. Replace `'YOUR_PLAYLIST_ID_HERE'` with your actual playlist ID
4. Example: `const YOUTUBE_PLAYLIST_ID = 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf';`
5. Save the file

The playlist will now automatically embed on your website!

---

## 📸 Adding Photos

### Option 1: Automated Script (Recommended)

We have a Python script that will:
- Optimize images (compress to web-friendly size)
- Resize to consistent dimensions
- Copy to the website gallery folder

**Usage:**
```bash
# From the ade-fintech directory
python3 optimize_images.py /path/to/your/photos
```

### Option 2: Manual Process

#### Step 1: Optimize Your Photos

Before adding photos, optimize them for web:
- **Recommended size**: 1920x1080px or similar
- **File size**: Aim for 300-800KB per image
- **Format**: JPEG (.jpg)

You can use online tools like:
- TinyPNG.com
- Squoosh.app
- Photoshop "Save for Web"

#### Step 2: Copy to Gallery Folder

1. Copy optimized photos to: `ade-fintech/assets/images/gallery/`
2. Name them systematically:
   - `event-001.jpg`
   - `event-002.jpg`
   - `event-003.jpg`
   - etc.

#### Step 3: Update the Photo List

1. Open `assets/js/main.js`
2. Find the `loadPhotos()` function (around line 182)
3. Add your photo filenames to the `photoFiles` array:

```javascript
const photoFiles = [
    'event-001.jpg',
    'event-002.jpg',
    'event-003.jpg',
    'event-004.jpg',
    // ... add more as needed
];
```

4. Save the file

---

## 🎨 Gallery Filters

The gallery has automatic filters:
- **All** - Shows everything
- **Photos** - Shows only photos
- **Videos** - Shows only the YouTube embed
- **Reels** - (Currently same as Videos)

These work automatically once you add content!

---

## ✅ Quick Checklist

- [ ] Upload reels to YouTube and create a playlist
- [ ] Get the YouTube playlist ID
- [ ] Update `YOUTUBE_PLAYLIST_ID` in `assets/js/main.js`
- [ ] Select 30-50 best photos from the event
- [ ] Optimize photos (compress and resize)
- [ ] Copy photos to `assets/images/gallery/`
- [ ] Update `photoFiles` array in `assets/js/main.js`
- [ ] Test the website locally
- [ ] Commit and push to GitHub

---

## 🧪 Testing Locally

```bash
cd ade-fintech
python3 -m http.server 8080
```

Then visit: `http://localhost:8080`

---

## 🚀 Publishing to GitHub

Once everything looks good:

```bash
cd ade-fintech
git add .
git commit -m "Add gallery photos and YouTube playlist"
git push origin main
```

---

## 📝 Notes

- **Photo Limit**: Keep total photos under 50-100 for best performance
- **File Size**: Each photo should be < 1MB
- **YouTube**: Videos don't count toward your repository size!
- **Backup**: Keep original high-res photos in Google Drive as backup

---

## ❓ Need Help?

If you run into issues:
1. Check the browser console for errors (F12 → Console tab)
2. Verify file paths are correct
3. Make sure photos are in the `assets/images/gallery/` folder
4. Ensure the YouTube playlist is set to "Public" or "Unlisted"
