'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 880,
    minHeight: 560,
    frame: false,
    backgroundColor: '#070612',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('maximize', () => mainWindow.webContents.send('window:maximized', true));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window:maximized', false));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ----------------------------- window controls ---------------------------- */

ipcMain.on('window:minimize', () => mainWindow && mainWindow.minimize());
ipcMain.on('window:maximizeToggle', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window:close', () => mainWindow && mainWindow.close());

/* -------------------------------- dialogs --------------------------------- */

ipcMain.handle('folder:pick', async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose a folder to scan',
    properties: ['openDirectory']
  });
  if (res.canceled || !res.filePaths.length) return null;
  return res.filePaths[0];
});

ipcMain.handle('path:reveal', async (_e, target) => {
  try { shell.showItemInFolder(target); return true; } catch { return false; }
});

/* ----------------------------- scan utilities ----------------------------- */

async function* walk(dir) {
  let entries;
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch {
    return; // unreadable folder, skip
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(channel, payload);
}

ipcMain.handle('scan:run', async (_e, folder) => {
  if (!folder) return { error: 'No folder selected.' };

  // 1) collect every file with its size
  send('scan:progress', { phase: 'walk', message: 'Mapping files…', count: 0 });
  const bySize = new Map(); // size -> [paths]
  let counted = 0;
  for await (const file of walk(folder)) {
    let stat;
    try { stat = await fsp.stat(file); } catch { continue; }
    if (stat.size === 0) continue; // ignore empty files
    counted++;
    if (counted % 75 === 0) send('scan:progress', { phase: 'walk', message: 'Mapping files…', count: counted });
    const arr = bySize.get(stat.size);
    if (arr) arr.push({ path: file, size: stat.size, mtime: stat.mtimeMs });
    else bySize.set(stat.size, [{ path: file, size: stat.size, mtime: stat.mtimeMs }]);
  }

  // 2) only size-collisions can be duplicates -> hash those
  const candidates = [];
  for (const list of bySize.values()) if (list.length > 1) candidates.push(...list);

  const total = candidates.length;
  const byHash = new Map(); // hash -> [fileinfo]
  let hashed = 0;
  for (const info of candidates) {
    try {
      const h = await hashFile(info.path);
      const arr = byHash.get(h);
      const item = { ...info, name: path.basename(info.path), dir: path.dirname(info.path) };
      if (arr) arr.push(item); else byHash.set(h, [item]);
    } catch { /* unreadable file, skip */ }
    hashed++;
    if (hashed % 5 === 0 || hashed === total) {
      send('scan:progress', { phase: 'hash', message: 'Comparing contents…', done: hashed, total });
    }
  }

  // 3) build duplicate groups (>1 identical file)
  let groups = [];
  let dupeFiles = 0;
  let reclaimable = 0;
  for (const [hash, files] of byHash.entries()) {
    if (files.length < 2) continue;
    // keep the oldest (earliest mtime); mark the rest for deletion by default
    files.sort((a, b) => a.mtime - b.mtime);
    const wastedBytes = files[0].size * (files.length - 1);
    reclaimable += wastedBytes;
    dupeFiles += files.length - 1;
    groups.push({
      id: hash.slice(0, 16),
      size: files[0].size,
      wastedBytes,
      files: files.map((f, i) => ({ ...f, keep: i === 0 }))
    });
  }

  groups.sort((a, b) => b.wastedBytes - a.wastedBytes);

  return {
    folder,
    scanned: counted,
    groupCount: groups.length,
    dupeFiles,
    reclaimable,
    groups
  };
});

/* -------------------------------- deletion -------------------------------- */
/* Uses the OS Recycle Bin (shell.trashItem) so nothing is gone for good. */

ipcMain.handle('files:trash', async (_e, paths) => {
  const result = { removed: [], failed: [] };
  if (!Array.isArray(paths)) return result;
  for (const p of paths) {
    try {
      await shell.trashItem(p);
      result.removed.push(p);
    } catch (err) {
      result.failed.push({ path: p, reason: String(err && err.message || err) });
    }
  }
  return result;
});
