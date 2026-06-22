<p align="center">
  <img src="build/icon.png" alt="DupeNova icon" width="180" height="180" />
</p>

<h1 align="center">DupeNova ✦ duplicate purifier</h1>

**DupeNova finds files that are exact copies of each other and clears out the spare
copies for you — so you get your storage space back without losing anything.**

You point it at a folder, it looks through everything inside, and it shows you any files
that are identical twins. You decide which copy to keep, and the extras get moved to
your Recycle Bin (so they're easy to get back if you change your mind). It's wrapped in a
calm, glowing "space aurora" look that's actually pleasant to use.

> **In one sentence:** pick a folder → it finds the real duplicates → it tidies away the
> spare copies into the Recycle Bin. Simple and safe.

---

## ✨ What it does (features)

- **Finds real duplicates, not just files with the same name.** DupeNova compares what's
  actually *inside* each file, not just its name. So a photo called `holiday.jpg` and a
  copy of it called `holiday (1).jpg` are correctly spotted as the same picture — and two
  *different* photos that happen to share a name are correctly left alone. It only flags
  files that are **truly identical, down to the last detail**.
- **Looks inside every folder for you.** Pick one folder and it automatically checks all
  the folders tucked inside it too. You don't have to go digging.
- **Quick, even on big folders.** It's smart about how it searches, so it doesn't waste
  time or slow your computer down.
- **Nothing is ever deleted for good.** When you clear out duplicates, they go to your
  **Recycle Bin** — exactly like dragging a file there yourself. If you change your mind,
  you can restore them anytime.
- **You're always in charge of what stays.** For each set of duplicates, DupeNova keeps
  one copy and suggests removing the rest. You can change which one is kept with a click,
  or use the handy "keep the newest" / "keep the oldest" buttons to decide all at once.
  It will never leave you with zero copies of a file.
- **Clear numbers before you commit.** Before you remove anything, you can see how many
  files it checked, how many duplicates it found, and **exactly how much space you'll get
  back** — so there are no surprises.
- **Double-check any file yourself.** Double-click a file in the list and it opens that
  file's location on your computer, so you can confirm it before removing anything.
- **A genuinely nice look.** Soft glowing colours, gentle drifting sparkles, and smooth
  animations. Prefer things calm and still? It automatically tones the motion down if your
  computer is set to reduce animations.
- **Works without the internet.** You don't need to be online to use it.

---

## 🆚 How it's different from other "duplicate cleaner" apps

- **It checks the real contents, so it never guesses.** A lot of cleanup tools match
  files just by name or size, which can lead to mistakes. DupeNova only matches files
  that are *genuinely identical*, so it won't remove something that merely looked similar.
- **It can't delete anything for good.** Everything it removes goes to the Recycle Bin,
  so a mistake is never permanent.
- **No account, no sign-up, no tracking.** It doesn't ask who you are, doesn't send
  anything about you anywhere, and works entirely on your own computer.
- **You can see exactly what it does.** It's open and honest — anyone curious (or
  cautious) can look at how it works (see the **"Is this safe?"** section below).
- **It's actually pleasant.** Most apps like this look like a dull spreadsheet. This one
  is calm and pretty, without giving up any of the safety.

---

## 🚀 How to set it up (no tech knowledge needed)

You don't need to know anything about computers beyond clicking and double-clicking. Just
follow these steps in order.

### Step 1 — Install the free helper it needs (one time only)

DupeNova needs a small, free, official program called **Node.js** to run. Installing it
is just like installing any normal app:

1. Go to **https://nodejs.org**
2. Click the big button labelled **"LTS"** (that just means the stable, recommended
   version).
3. Open the file you downloaded and click **Next → Next → Install**. You don't need to
   change any settings.

That's it — you only ever do this once.

### Step 2 — Unzip DupeNova

Extract (unzip) the DupeNova folder anywhere you like — your Desktop is perfectly fine.
You'll end up with a folder containing files named things like `DupeNova` and `start`.

### Step 3 — Open it

Double-click **`DupeNova`** (the file named `DupeNova.vbs`). That's the normal way to
open it.

> **The very first time, give it a minute.** The first time you open DupeNova, it quietly
> sets itself up in the background. You'll see a little "Setting up DupeNova for the first
> time…" message, and the app window appears on its own when it's ready. Every time after
> that, it opens quickly.
>
> *(There's also a file named `start.bat`. It opens the app the same way but shows a black
> text window while it works — handy only if something goes wrong and you want to see the
> details. For everyday use, just use `DupeNova`.)*

### Step 4 — Use it

1. Click **Choose folder** and pick the folder you want to tidy up.
2. Click **Scan for duplicates** and wait a moment.
3. Look over what it found. Keep the defaults, or click to change which copy stays.
4. Click **Purge → Recycle Bin**. Done! The spare copies are now in your Recycle Bin, and
   you can bring any of them back if you ever want to.

---

## 🛡️ "Is this safe? How do I know it's not a virus?"

That's a smart question to ask about *any* program — you should never run something you
can't trust. Here's the honest answer, in plain terms:

- **It can only move files to the Recycle Bin — never delete them for good.** So even in
  the worst case, nothing is lost; you can restore anything from the Recycle Bin.
- **It doesn't send anything about you or your files anywhere.** There's no account, no
  tracking, and your files never leave your computer. (See [`PRIVACY.md`](PRIVACY.md) for
  the full, honest details.)
- **It's completely open.** Unlike most programs, DupeNova isn't a sealed mystery box.
  Everything it does is written in plain files you (or any tech-savvy friend) can open and
  read.

### Want to verify it yourself (or have a friend check)?

You don't need to take anyone's word for it. The instructions DupeNova follows are written
in ordinary text files you can open in Notepad. If you're cautious — or know someone who
understands code — these are the files worth looking at, most important first:

| File to open | What it's for / what it proves |
|----------------|-----------------------------------|
| **`main.js`** | ⭐ **The key one.** This is the only part that ever touches your files, and you can see it does just three things: look through the folder you picked, compare the files, and move spare copies to the Recycle Bin. There's **no permanent deleting** and **nothing sent over the internet** anywhere in it. |
| **`preload.js`** | A short list of the *only* actions the app is even allowed to do: pick a folder, scan, move-to-Recycle-Bin, and open a file's location. Nothing sneaky is possible. |
| **`start.bat`** | The opener. In plain text, it just checks that the free helper (Node.js) is installed, sets the app up, and starts it. |
| **`DupeNova.vbs`** | The everyday opener. All it does is start `start.bat` quietly. |

**Still not sure?** Two easy options: run your antivirus on the folder, or test DupeNova
on a throwaway folder of junk files first and watch how it behaves before trusting it with
anything that matters.

> **One normal thing to expect:** the first time you open it, Windows might show a blue
> "Windows protected your PC" warning. That appears for almost any small app that isn't
> from a big company — it's not a sign of a virus. You can click **More info → Run anyway**.
> (And if you'd rather be sure first, read the files above.)

---

## ❤️ Credits

- **The idea:** **White Cat Feris** (`ferisooo`). DupeNova was Feris's idea — the dream of
  a duplicate cleaner that's safe, accurate, *and* genuinely lovely to look at is hers. 🐾
- **The building:** made by **Claude** (Anthropic), who turned Feris's idea into the
  finished app, the glowing look, and this guide.

Made with care for **White Cat Feris** 🐾 — her idea, Claude's hands.

---

## 📜 License, Terms & Privacy

- **License:** Free and open (MIT) — see the [`LICENSE`](LICENSE) file.
- **Terms of Use:** see [`TERMS.md`](TERMS.md). In short: **you're free to use, share, and
  make your own version of DupeNova — just credit Feris's idea and Claude's work.** It's
  provided as-is, and you're responsible for your own files and backups.
- **Privacy:** see [`PRIVACY.md`](PRIVACY.md). In short: **DupeNova collects nothing about
  you.** No account, no tracking; your files never leave your computer.

---

<details>
<summary><b>🤓 For the technically curious (optional — safe to ignore)</b></summary>

Everything below is for people who write code and want the under-the-hood details. You
do **not** need any of this to use DupeNova.

### How duplicate detection works

1. It walks the chosen folder (and every subfolder) and records each file's size.
2. Only files that share an exact size *could* be duplicates, so only those get hashed
   with streamed SHA-256 (streaming keeps memory low on big files).
3. Files with identical hashes are grouped. In each group the oldest file is kept by
   default; the rest are marked to purge. You can flip any of these, or use "keep newest /
   keep oldest in each".
4. Purging moves the marked copies to the Recycle Bin via Electron's `shell.trashItem`.

### File guide

| File | What it does |
|------|--------------|
| `DupeNova.vbs` | Silent launcher — runs `start.bat` hidden (no console window), logs to `launch.log`, shows a popup only on failure. |
| `start.bat` | Self-healing launcher. Clears the Electron skip-download env vars, runs `npm install` if needed, repairs the Electron binary in four escalating steps (install.js → ELECTRON_MIRROR → GitHub zip → full reinstall), builds the UI, then launches. |
| `build-exe.bat` | Builds an NSIS installer with electron-builder (installed on demand). |
| `package.json` | App metadata, the `build` (esbuild) and `start` scripts, pinned `electron`/`esbuild` dev deps, and the electron-builder config. |
| `main.js` | Electron main process: frameless window, window controls, folder picker, recursive scan + hashing, Recycle-Bin deletion — all over IPC. |
| `preload.js` | Bridges a tiny, named `window.api` to the renderer via `contextBridge` (context isolation on, node integration off). |
| `renderer/index.html` | The shell. References only local files; layered surfaces for background, content, particles, cursor trail, ripples. |
| `renderer/styles.css` | The neon aurora theme: animated blobs, grid veil, scanline, glowing type, glass panels, z-index layering, reduced-motion support. |
| `renderer/app.jsx` | Readable UI source (React): title bar, folder picker, stat strip, scan progress, duplicate-set list with per-file keep/purge toggles, toasts. |
| `renderer/app.js` | The pre-compiled UI (esbuild output of `app.jsx`). Rebuilt by `start.bat`; shipped so the app runs even if the build step is skipped. |
| `renderer/fx.js` | Cosmetic engine: particle field, cursor trail, click ripples on click-through `<canvas>` overlays. Honors `prefers-reduced-motion`. |
| `renderer/vendor/react*.js` | Vendored React 18 + ReactDOM 18 (UMD). No CDN, works offline. |
| `build/icon.ico` / `icon.png` | App / installer icon. |
| `LICENSE` | MIT. |

### Architecture notes

- **No internet needed to render.** React + ReactDOM are vendored locally as UMD files;
  the UI is written in `app.jsx` and pre-compiled to `app.js` with esbuild. Google Fonts is
  referenced for polish but the CSS falls back to system fonts when offline.
- **Safe Electron setup.** `contextIsolation: true`, `nodeIntegration: false`. All file
  system work happens in the main process and is called over IPC.
- **Build a Windows installer:** double-click `build-exe.bat` to produce an NSIS installer
  in the `dist` folder.

</details>
