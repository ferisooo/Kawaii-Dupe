# DupeNova ✦ duplicate purifier

A frameless, heavily-animated Electron desktop app that finds **true byte-for-byte
duplicate files** in a folder (and all its subfolders) and sends the extra copies to
the Windows Recycle Bin. Neon aurora theme — glowing text, drifting particles, a
cursor trail, click ripples, and staggered entrance animations throughout. No mascots.

> **In one sentence:** point it at a folder, it finds the real duplicates, and it
> moves the spare copies to the Recycle Bin so you can reclaim space without losing
> anything.

---

## ✨ Features

- **Finds *true* duplicates, not lookalikes.** Files are compared by their actual
  contents (streamed SHA-256 hashing), so two files only count as duplicates if they
  are byte-for-byte identical — even if their names are different. A file named
  `holiday.jpg` and a copy named `holiday (1).jpg` are correctly matched; two
  *different* photos that happen to share a name are not.
- **Scans every subfolder automatically.** Pick one folder and it walks the entire
  tree underneath it.
- **Fast by design.** It first groups files by size and only hashes files that share
  an exact size — anything with a unique size can't possibly be a duplicate, so it's
  skipped. Large files are streamed, so even big folders don't eat your memory.
- **Nothing is deleted permanently.** Purged copies go to the **Recycle Bin** via the
  operating system, so you can always restore them.
- **You stay in control of what's kept.** In each duplicate set the oldest file is
  kept by default; you can flip Keep/Purge on any individual file, or use
  **Keep newest in each** / **Keep oldest in each** to decide in bulk. A set can never
  end up with zero files kept.
- **Clear, honest stats.** See how many files were scanned, how many duplicate sets
  exist, how many extra copies there are, and exactly how much space you'll reclaim
  *before* you commit.
- **Double-click to reveal.** Double-click any file in the list to open it in Explorer
  and confirm it for yourself.
- **Beautiful neon aurora UI.** Animated background blobs, glowing type, a particle
  field, a cursor trail, and click ripples — with full **reduced-motion** support for
  anyone who prefers calmer visuals.
- **Works fully offline.** React is bundled locally; no internet connection is needed
  to run the app or render the interface.
- **Self-healing launcher.** The first launch installs everything and repairs the
  Electron binary automatically if the download breaks, in four escalating steps.

---

## 🆚 How DupeNova is different from other duplicate finders

- **Content-based, never name-based.** Many cleanup tools match on file name, size, or
  a "fuzzy" guess. DupeNova hashes the actual bytes, so its matches are exact — no
  false positives, no accidentally deleting a file that just *looked* similar.
- **Recycle Bin, not the void.** It never hard-deletes. Every removed copy is
  recoverable from the Recycle Bin, so a mistake is never permanent.
- **No accounts, no telemetry, no cloud.** It doesn't phone home, upload your file
  list, or require a login. Everything happens locally on your machine.
- **Readable and inspectable.** The whole app is a handful of small, plain files you
  can open and read (see the "is this safe?" section below). It's MIT-licensed and the
  source isn't obfuscated or minified beyond the bundled React library.
- **It's genuinely nice to use.** Most dedupe utilities look like spreadsheets from
  2003. This one is a calm, glowing aurora — without sacrificing safety or accuracy.

---

## 🚀 Setting it up (no coding experience needed)

You don't need to know anything about code. Just follow these steps in order.

### Step 1 — Install Node.js (one time only)

DupeNova needs a free helper called **Node.js** to run.

1. Go to **https://nodejs.org**
2. Click the big button that says **LTS** (it's the recommended version).
3. Open the file you downloaded and click **Next → Next → Install** like any normal
   program. You don't need to change any settings.

You only ever have to do this once.

### Step 2 — Unzip DupeNova

Extract the DupeNova zip file anywhere you like — your Desktop is fine. You should end
up with a folder containing files like `DupeNova.vbs`, `start.bat`, and `README.md`.

### Step 3 — Launch it

Double-click one of these:

- **`DupeNova.vbs`** — the everyday way. Runs with **no black console window**.
- **`start.bat`** — does the same thing but shows a console window, which is handy if
  something goes wrong and you want to see the details.

> **The very first launch takes a minute.** It quietly downloads and sets itself up.
> With `DupeNova.vbs` you'll see a small "Setting up DupeNova for the first time…"
> message; the app window opens by itself when it's ready. Every launch after that is
> fast. (If anything fails, details are saved to a `launch.log` file next to the app.)

### Step 4 — Use it

1. Click **Choose folder** and pick the folder you want to clean up.
2. Click **Scan for duplicates** and wait for it to finish.
3. Review the duplicate sets. Adjust Keep/Purge if you want, or use the bulk buttons.
4. Click **Purge → Recycle Bin**. Done! The extra copies are now in your Recycle Bin,
   and you can restore them anytime if you change your mind.

### (Optional) Make a proper Windows installer

If you'd rather install DupeNova like a normal app with a Start-menu shortcut,
double-click **`build-exe.bat`**. It builds a standard Windows installer into a `dist`
folder.

---

## 🛡️ "Is this safe? How do I know it's not a virus?"

Totally fair question — you should never run something you can't verify. The good news:
**DupeNova is small, open, and readable.** You don't have to trust anyone's word for
it; you can open the files yourself in Notepad (or any text editor) and see exactly
what it does. Here's what to read, in order of importance:

| Read this file | Why it matters / what to look for |
|----------------|-----------------------------------|
| **`main.js`** | ⭐ **The most important one.** This is the only file that touches your files. You can see it does exactly three things: **lists** files in the folder you chose, **reads** them to compare contents, and **moves** copies to the Recycle Bin using the operating system's own "trash" function (`shell.trashItem`). There is **no permanent deletion** and **no network upload** anywhere in it. |
| **`preload.js`** | Tiny file listing the *only* actions the app's interface is allowed to ask for: pick a folder, scan, move-to-Recycle-Bin, reveal in Explorer, and basic window buttons. Nothing else is possible. |
| **`start.bat`** | The launcher. You can read every command it runs: it checks for Node.js, installs the app's dependencies, repairs Electron if its download broke, and starts the app. All of it is plain, commented text. |
| **`DupeNova.vbs`** | The silent launcher. All it does is run `start.bat` without a console window and write a `launch.log`. |
| **`package.json`** | Lists exactly which two building blocks it uses (`electron` and `esbuild`) and nothing sneaky. No hidden install scripts pulling random code. |

**Extra reassurances:**

- **It only sends files to the Recycle Bin, never permanent deletion.** Anything it
  removes can be restored.
- **It doesn't connect to the internet to do its job.** The interface library (React)
  is bundled in the `renderer/vendor` folder; no data about your files ever leaves your
  computer.
- **It's MIT-licensed open source** — see the `LICENSE` file.
- If you're still unsure, you can run a virus scan on the folder, or test the app on a
  throwaway folder of duplicate files first and watch it work before trusting it with
  anything important.

> Note: because this is an unsigned community app, Windows SmartScreen may show a "are
> you sure?" prompt the first time. That's normal for indie software and not a sign of
> a virus — but reading the files above is the real way to be sure.

---

## How duplicate detection works (the technical version)

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

---

## Credits

- **Idea, concept & direction:** **White Cat Feris** (`ferisooo`). DupeNova was Feris's
  idea — the goal of a safe, content-accurate, genuinely *pretty* duplicate purifier is
  hers. 🐾
- **Implementation:** built by **Claude** (Anthropic), turning Feris's idea into the
  working Electron app, the neon aurora interface, the self-healing launcher, and this
  documentation.

Made with care for **White Cat Feris** 🐾 — her idea, Claude's hands.

---

## License, Terms & Privacy

- **License:** MIT — see the [`LICENSE`](LICENSE) file.
- **Terms of Service:** see [`TERMS.md`](TERMS.md). In short: **you may freely use,
  fork, modify, and distribute DupeNova — as long as you credit White Cat Feris's idea
  and Claude's work.** The App is provided "as is" with no warranty, and you are
  responsible for your own files and backups.
- **Privacy Policy:** see [`PRIVACY.md`](PRIVACY.md). In short: **DupeNova collects
  nothing.** No accounts, no analytics, no tracking; your files never leave your
  computer. The only optional internet use is loading decorative Google Fonts when
  you're online (it falls back to system fonts offline).
