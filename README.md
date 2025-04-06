# IR35 Highlighter Chrome Extension

A lightweight Chrome extension that automatically highlights the phrases **"Inside IR35"** and **"Outside IR35"** on any web page.

---

## ✨ Features

- Highlights "Inside IR35" in red and "Outside IR35" in green.
- Runs automatically on all websites.
- No user interaction required.
- CI/CD support: Linting, security scanning, packaging, and release.

---

## 📸 Screenshot

Below is a simulated example of the extension's behavior:

![IR35 Highlight Example](ir35-highlight-screenshot.png)

---

## 📦 Installation (Local)

To install it manually:

1. Clone or [download the release](https://github.com/YOUR_USERNAME/ir35-highlighter/releases).
2. Unzip the extension if downloaded.
3. Go to `chrome://extensions/` in your Chrome browser.
4. Enable **Developer Mode** (toggle in top right).
5. Click **Load unpacked**.
6. Select the folder containing:
   - `manifest.json`
   - `content.js`
   - `styles.css`

The phrases will be highlighted automatically when detected on any webpage.

---

## 🧩 Optional: Add a Browser Icon

If you want a toolbar icon:

1. Add an icon file (e.g. `icon.png`) to the root directory.
2. Update `manifest.json`:

```json
"action": {
  "default_icon": {
    "16": "icon.png"
  },
  "default_title": "IR35 Highlighter"
}
```

---

## 🚀 Development & CI/CD

### Folder structure

```text
.
├── manifest.json
├── content.js
├── styles.css
├── README.md
├── ir35-highlight-screenshot.png
└── .github/
    └── workflows/
        ├── validate-extension.yml
        └── package-and-release-extension.yml
```

### Releasing

- Tag a new release with `vX.Y.Z` (e.g. `v1.0.0`) to trigger the release workflow.
- The workflow will:
  - Zip the extension
  - Upload it as a GitHub release
  - Attach it as a build artifact

---

## 🔁 Auto-Versioning (optional)

To automatically update `manifest.json` with the tag version:
- Add a custom script step before zipping:

```bash
VERSION=${GITHUB_REF#refs/tags/}
jq --arg version "$VERSION" '.version = $version' manifest.json > tmp && mv tmp manifest.json
```

---

## 🔐 Required Secret

- `GH_TOKEN`: GitHub personal access token with `repo` scope (for release uploads).

---
