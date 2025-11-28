# How to Run the Projects Page

## ❌ Problem: Opening with file:// Protocol

When you open `projects.html` directly by double-clicking it, your browser uses the `file://` protocol which causes:
- ❌ 404 errors for resources
- ❌ CORS errors for embedded videos (Loom, YouTube)
- ❌ JavaScript fetch() failures
- ❌ "Uncaught SyntaxError" errors

## ✅ Solution: Use a Local Web Server

### Option 1: Python HTTP Server (Recommended)

**Open Terminal/Command Prompt:**

```bash
# Navigate to the project directory
cd /Users/ankit/Documents/nyc_championship/ade-fintech

# Start the server
python3 -m http.server 8888

# You should see:
# Serving HTTP on :: port 8888 (http://[::]:8888/) ...
```

**Open your browser and go to:**
```
http://localhost:8888/projects.html
```

**To stop the server:**
Press `Ctrl+C` in the terminal

---

### Option 2: Using VS Code Live Server

If you use VS Code:

1. Install "Live Server" extension
2. Right-click `projects.html`
3. Select "Open with Live Server"

---

### Option 3: Using Node.js http-server

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project directory
cd /Users/ankit/Documents/nyc_championship/ade-fintech

# Start server
http-server -p 8888

# Open: http://localhost:8888/projects.html
```

---

## 🔍 Verify It's Working

After starting the server and opening http://localhost:8888/projects.html:

### Check Console (F12):
You should see:
```
✅ Loaded projects: 48
✅ First project: Skywalkers77 (2nd) { hasAbstract: true, hasSummary: true, hasYouTube: true }
✅ First project render: { ... }
```

**No more errors like:**
- ❌ "Failed to load resource: the server responded with a status of 404"
- ❌ "Uncaught SyntaxError: Invalid or unexpected token"
- ❌ CORS errors

### Visual Check:
1. ✅ Projects table loads
2. ✅ Short abstracts visible (e.g., "Credit Memo Generation")
3. ✅ "View Details" button works
4. ✅ Videos embed correctly (YouTube, Loom, Vimeo)
5. ✅ Darker blue/green colors (not bright neon)

---

## 🎯 Quick Start Script

Save this as `start.sh` in the project directory:

```bash
#!/bin/bash
cd /Users/ankit/Documents/nyc_championship/ade-fintech
echo "Starting server on http://localhost:8888"
echo "Open your browser to: http://localhost:8888/projects.html"
echo ""
echo "Press Ctrl+C to stop the server"
python3 -m http.server 8888
```

Make it executable:
```bash
chmod +x start.sh
```

Run it:
```bash
./start.sh
```

---

## 🐛 Troubleshooting

### Port Already in Use
If you see "Address already in use":

```bash
# Find what's using port 8888
lsof -ti:8888

# Kill it
kill -9 $(lsof -ti:8888)

# Or use a different port
python3 -m http.server 9999
# Then open: http://localhost:9999/projects.html
```

### Still Seeing Errors?

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache:** F12 → Application → Clear Storage → Clear site data
3. **Try incognito mode:** Ctrl+Shift+N or Cmd+Shift+N
4. **Check console:** F12 → Console tab for any remaining errors

---

## 📋 Current Status

- ✅ Server running on http://localhost:8888
- ✅ All files updated to v=14
- ✅ Short abstracts (2-6 words)
- ✅ Darker colors (not bright green)
- ✅ Video embedding ready for YouTube, Loom, Vimeo

**Just open:** http://localhost:8888/projects.html

---

## 🎉 What You Should See

### Table:
| Team Name | Abstract | Links |
|-----------|----------|-------|
| Skywalkers77 (2nd) | Invoice & Contract Compliance Automation | [View Details] |
| ai_banking_geek | Credit Memo Generation | [View Details] |

### Click "View Details":
```
┌─────────────────────────────────────┐
│ Executive Summary                   │
│ Ernie eliminates manual credit...   │
├─────────────────────────────────────┤
│ Demo Video                          │
│ [▶️ Embedded YouTube Player]        │
├─────────────────────────────────────┤
│ Project Links                       │
│ [GitHub] [YouTube]                  │
└─────────────────────────────────────┘
```

**No 404 errors! No syntax errors! Videos play!** 🎉
