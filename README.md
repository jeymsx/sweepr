# Sweepr

A fast, privacy-first disk space analyzer and cleanup tool for Windows.

Sweepr scans your drives and folders to show you what's taking up space — then lets you clean it up. Everything runs locally. No data ever leaves your device.

---

## Download

**[→ Download the latest version](https://github.com/jeymsx/sweepr/releases/latest)**

Run `Sweepr Setup x.x.x.exe` and follow the installer. Sweepr will notify you automatically when a new version is available.

---

## Features

- **Fast scanner** — concurrent directory traversal with real-time progress, files/sec, and ETA
- **Smart filters** — filter by file type, size range, and date before or after scanning
- **Results view** — sort by size, name, date, or type; switch between list and card layout; resize columns
- **Bulk delete** — select files and send them to the Recycle Bin in one click
- **Locations** — overview of all local drives with usage bars, free space, and a storage donut chart
- **Saved directories** — pin frequently scanned folders for quick access
- **Include folders** — show folder size totals alongside individual files
- **Dark mode** — full dark and light theme support
- **Auto-update** — checks for updates in the background and prompts you to install

---

## Privacy

Sweepr is 100% offline. It reads file metadata (names, sizes, paths, dates) locally to display results and never uploads, transmits, or shares anything. See the [Privacy Policy](https://github.com/jeymsx/sweepr/releases/latest) in the app for full details.

---

## Built With

| Technology | Role |
|------------|------|
| [Electron](https://www.electronjs.org) | Desktop app framework |
| [React](https://react.dev) | UI library |
| [Vite](https://vitejs.dev) | Build tool |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [electron-builder](https://www.electron.build) | Packaging & installer |
| [electron-updater](https://www.electron.build/auto-update) | Auto-update |

---

## Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Build the installer
npm run dist
```

Requires Node.js 18+ and npm.

---

## License

MIT — see [LICENSE](LICENSE) for details.

Copyright © 2026 Sweepr
