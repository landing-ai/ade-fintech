<div align="center">

# 🏆 Agentic Document Extraction - Financial Services

**Financial AI Hackathon Championship 2025**
*November 15, New York*

[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://landing-ai.github.io/ade-fintech)
[![Projects](https://img.shields.io/badge/Projects-48-blue)](#-all-projects)
[![Developers](https://img.shields.io/badge/Developers-1000+-orange)](#)
[![Community](https://img.shields.io/badge/Community-Join-purple)](https://discord.gg/landingai)

*Community-built fintech solutions powered by LandingAI's Agentic Document Extraction*

[View Website](https://landing-ai.github.io/ade-fintech) • [Join Discord](https://discord.gg/landingai) • [Follow on Luma](https://lu.ma/landingai)

</div>

---

## 🏗️ Architecture

This project uses a hybrid architecture:

1.  **Frontend (GitHub Pages):** Static HTML/JS serving the UI.
2.  **Projects Data (Git as CMS):** Project data is stored in `data/projects_data.json` on the `master` branch. The frontend fetches this directly from GitHub Raw, allowing decentralized updates via Pull Requests.
3.  **Backend (Node.js/PostgreSQL):** A secure API handles Admin Authentication and Certificate Verification/Generation.

### Tech Stack
*   **Frontend:** HTML5, CSS3, Vanilla JS
*   **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
*   **Hosting:** GitHub Pages (Frontend), [Your Backend Host] (Backend)

---

## 🚀 Local Development

### Frontend
```bash
# Clone the repository
git clone https://github.com/landing-ai/ade-fintech.git
cd ade-fintech

# Start a local server
python3 -m http.server 8000
# OR
npx http-server -p 8000

# Open in browser
open http://localhost:8000
```

### Backend
The backend is located in `ade-fintech-backend/`.

```bash
cd ade-fintech-backend

# Install dependencies
npm install

# Start Database (Docker)
docker-compose up -d

# Run Migrations
npx prisma migrate dev

# Start Server
npm run dev
```

---

## 🔐 Admin Panel

The Admin Panel (`admin.html`) is now a secure dashboard connected to the backend.
*   **Login:** Requires an account in the `User` database table.
*   **Manage Certificates:** Add, edit, or delete certificates.
*   **Manage Projects:** Links directly to the GitHub repository file for editing.

---

## 🥇 Championship Winners

| Award | Team | Project |
|:------|:-----|:--------|
| 🏆 **Champion** | **LoanLens AI** | Loan Underwriting & Fraud Detection |
| 🥈 **Runner-Up** | **Skywalkers77** | Invoice & Contract Compliance Automation |
| 🏅 **Best Online App** | **Beemnet Haile** | OTC Derivatives Collateral Management |

---

## 🤝 Join Our Community

**Be part of the next wave of Visual AI innovation!** 🚀

### Get Involved
<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/landingai)
[![Luma](https://img.shields.io/badge/Luma-Follow%20Events-FF6B6B?style=for-the-badge)](https://lu.ma/landingai)

</div>

---

## 📄 License

© 2025 LandingAI. All rights reserved.