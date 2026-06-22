# DupeNova ✦ duplicate purifier

A frameless, heavily-animated Electron desktop app that finds **true byte-for-byte
duplicate files** in a folder (and all its subfolders) and sends the extra copies to
the Windows Recycle Bin. Neon aurora theme — glowing text, drifting particles, a
cursor trail, click ripples, and staggered entrance animations throughout. No mascots.

---

## Run it

1. Extract the zip anywhere.
2. Launch it:
   - **`DupeNova.vbs`** → runs with **no console window** (recommended for everyday use).
   - **`start.bat`** → same thing but shows a console, handy for troubleshooting.
   - First launch installs dependencies and builds the UI automatically, and self-heals
     the Electron binary if the download breaks. With the silent launcher, a one-time
     "setting up…" notice appears; the app window opens when it's ready. Output is written
     to `launch.log`, and a popup appears only if something fails.
3. The window opens. Choose a folder → **Scan for duplicates** → review → **Purge**.

> Requires **Node.js** (LTS) installed on the PC: https://nodejs.org
> Deleted files go to the **Recycle Bin**, so nothing is lost permanently.

## Build a Windows installer (optional)

Double-click **`build-exe.bat`**. It installs `electron-builder` on demand and outputs
an NSIS installer into the `dist` folder.

---

## How duplicate detection works

1. Walks the chosen folder recursively and records every file's size.
2. Only files that share an exact size can possibly be duplicates — those get hashed
   (streamed SHA-256, so big files don't eat memory).
3. Files with identical hashes are grouped. In each group the **oldest** file is kept by
   default and the rest are marked to purge — you can flip any of these per file, or use
   "Keep newest / Keep oldest in each".
4. Purging moves the marked copies to the Recycle Bin via Electron's `shell.trashItem`.

---

## File guide

| File | What it does |
|------|--------------|
| `DupeNova.vbs` | Silent launcher — runs `start.bat` hidden (no console window), logs to `launch.log`, and shows a popup only on failure. Use this for everyday launching. |
| `start.bat` | Self-healing launcher. Clears the Electron skip-download env vars, runs `npm install` if needed, verifies `node_modules\electron\path.txt`, repairs the Electron binary in four escalating steps (install.js → ELECTRON_MIRROR → GitHub zip download → full reinstall), builds the UI, then launches. Skips its pause prompts when started by `DupeNova.vbs`. |
| `build-exe.bat` | Builds an NSIS installer with electron-builder (installed on demand, `asar: false`, app icon). |
| `package.json` | App metadata, the `build` (esbuild) and `start` scripts, pinned `electron`/`esbuild` dev deps, and the electron-builder config. |
| `main.js` | Electron **main process**. Creates the frameless window; handles window controls, the folder picker, the recursive scan + hashing, and Recycle-Bin deletion — all over IPC. |
| `preload.js` | Bridges a tiny, named `window.api` to the renderer via `contextBridge` (context isolation on, node integration off). |
| `renderer/index.html` | The shell. References only local files. Layered surfaces for background, content, particles, cursor trail, and click ripples. Loads vendored React, the compiled UI, and the FX engine. |
| `renderer/styles.css` | The neon aurora theme: animated background blobs, grid veil, scanline, glowing type, glass panels, hover/transition effects, z-index layering, reduced-motion support. |
| `renderer/app.jsx` | **Readable UI source** (React). Title bar, folder picker, stat strip, scan progress, duplicate-set list with per-file keep/purge toggles, and toasts. |
| `renderer/app.js` | The pre-compiled UI (esbuild output of `app.jsx`). Rebuilt by `start.bat`; shipped so the app still runs if the build step is skipped. |
| `renderer/fx.js` | Cosmetic engine: particle field, cursor trail, and click ripples on `<canvas>` overlays (all click-through). Honors `prefers-reduced-motion`. |
| `renderer/vendor/react.production.min.js` | Vendored React 18 (UMD). No CDN, works offline. |
| `renderer/vendor/react-dom.production.min.js` | Vendored ReactDOM 18 (UMD). |
| `build/icon.ico` | App / installer icon (overlapping neon squares). |
| `build/icon.png` | PNG preview of the icon. |
| `LICENSE` | MIT. |

---

## Architecture notes

- **No internet needed to render.** React + ReactDOM are vendored locally as UMD files;
  the UI is written in `app.jsx` and pre-compiled to `app.js` with esbuild. No CDN, no
  in-browser Babel. Google Fonts is referenced for polish but the CSS falls back to system
  fonts when offline.
- **Safe Electron setup.** `contextIsolation: true`, `nodeIntegration: false`. All file
  system work happens in the main process and is called over IPC; a descriptive
  User-Agent is set for any web requests (none are needed for normal use).
- **Z-index layering.** The title bar/controls live in their own stacking layer above the
  content so menus render on top; the particle and cursor-trail canvases sit above content
  (click-through) so the cosmetics stay visible even on a full screen.

Made for **White Cat Feris** 🐾
