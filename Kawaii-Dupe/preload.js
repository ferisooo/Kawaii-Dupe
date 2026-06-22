'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // window controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximizeToggle: () => ipcRenderer.send('window:maximizeToggle'),
  close: () => ipcRenderer.send('window:close'),
  onMaximizeChange: (cb) => {
    const handler = (_e, val) => cb(val);
    ipcRenderer.on('window:maximized', handler);
    return () => ipcRenderer.removeListener('window:maximized', handler);
  },

  // actions
  pickFolder: () => ipcRenderer.invoke('folder:pick'),
  scan: (folder) => ipcRenderer.invoke('scan:run', folder),
  trash: (paths) => ipcRenderer.invoke('files:trash', paths),
  reveal: (target) => ipcRenderer.invoke('path:reveal', target),

  // scan progress stream
  onScanProgress: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on('scan:progress', handler);
    return () => ipcRenderer.removeListener('scan:progress', handler);
  }
});
