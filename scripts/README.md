# Certificate Image Generator

This script generates individual certificate images for each participant to enable personalized social media previews.

## Prerequisites

1. Install Node.js (if not already installed)
2. Install dependencies:
   ```bash
   cd scripts
   npm install puppeteer
   ```

## Usage

### Option 1: Generate from deployed site (Recommended)

```bash
node generate-certificates-from-url.js
```

This will:
- Fetch the list of certificates from the deployed site
- Generate individual PNG images for each certificate
- Save them to `assets/images/certificates/generated/`

### Option 2: Generate from local server

1. Start a local web server in the project root:
   ```bash
   python3 -m http.server 8000
   ```

2. Run the generator:
   ```bash
   node generate-certificate-images.js
   ```

## Output

Generated certificate images will be saved to:
```
assets/images/certificates/generated/
├── ADE-53D8-55B8.png
├── ADE-1234-5678.png
└── ...
```

Each image is 2441x1768 pixels (native certificate resolution) and includes:
- Participant name
- Certificate ID
- Date
- Full certificate design

## How it works

1. The script reads the certificate list from `data/certificate_list.csv`
2. For each certificate, it:
   - Opens the certificate page with the participant's ID
   - Waits for the certificate to render
   - Takes a screenshot of the certificate card
   - Saves it as a PNG file named with the certificate ID

## Social Media Integration

Once generated, these images are automatically used for social media previews when certificate URLs are shared. The meta tags in `certificates.html` will point to the personalized images.
