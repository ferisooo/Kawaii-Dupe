"use strict";
const { useState, useEffect, useRef, useCallback } = React;
function formatBytes(n) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + u[i];
}
const Icon = {
  folder: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })),
  scan: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "m21 21-4.3-4.3" })),
  trash: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m1 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" })),
  layers: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", ...p }, /* @__PURE__ */ React.createElement("path", { d: "m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5" }))
};
function TitleBar() {
  const [max, setMax] = useState(false);
  useEffect(() => window.api.onMaximizeChange(setMax), []);
  return /* @__PURE__ */ React.createElement("div", { className: "titlebar" }, /* @__PURE__ */ React.createElement("div", { className: "brand" }, /* @__PURE__ */ React.createElement("span", { className: "mark" }), /* @__PURE__ */ React.createElement("span", { className: "glow-text" }, "DUPENOVA"), /* @__PURE__ */ React.createElement("span", { className: "tag" }, "duplicate purifier")), /* @__PURE__ */ React.createElement("div", { className: "win-controls" }, /* @__PURE__ */ React.createElement("button", { className: "win-btn", title: "Minimize", onClick: () => window.api.minimize() }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12" }, /* @__PURE__ */ React.createElement("path", { d: "M2 6h8", stroke: "currentColor", strokeWidth: "1.4" }))), /* @__PURE__ */ React.createElement("button", { className: "win-btn", title: max ? "Restore" : "Maximize", onClick: () => window.api.maximizeToggle() }, max ? /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "1.5", width: "6", height: "6" }), /* @__PURE__ */ React.createElement("rect", { x: "1.5", y: "3.5", width: "6", height: "6", fill: "var(--void)" })) : /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "8", height: "8" }))), /* @__PURE__ */ React.createElement("button", { className: "win-btn close", title: "Close", onClick: () => window.api.close() }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12" }, /* @__PURE__ */ React.createElement("path", { d: "M3 3l6 6M9 3l-6 6", stroke: "currentColor", strokeWidth: "1.4" })))));
}
function FileRow({ file, onSet }) {
  return /* @__PURE__ */ React.createElement("div", { className: "file-row" }, /* @__PURE__ */ React.createElement("span", { className: "dot " + (file.keep ? "keep" : "purge") }), /* @__PURE__ */ React.createElement("div", { className: "file-info", onDoubleClick: () => window.api.reveal(file.path), title: "Double-click to reveal in Explorer" }, /* @__PURE__ */ React.createElement("div", { className: "fname" }, file.name), /* @__PURE__ */ React.createElement("div", { className: "fpath" }, file.dir)), /* @__PURE__ */ React.createElement("div", { className: "row-actions" }, /* @__PURE__ */ React.createElement("button", { className: "chip " + (file.keep ? "active-keep" : ""), onClick: () => onSet(true) }, "Keep"), /* @__PURE__ */ React.createElement("button", { className: "chip " + (!file.keep ? "active-purge" : ""), onClick: () => onSet(false) }, "Purge")));
}
function Group({ group, index, onSet, collapsing }) {
  const purgeCount = group.files.filter((f) => !f.keep).length;
  return /* @__PURE__ */ React.createElement("div", { className: "group" + (collapsing ? " collapsing" : ""), style: { animationDelay: Math.min(index * 0.04, 0.5) + "s" } }, /* @__PURE__ */ React.createElement("div", { className: "group-head" }, /* @__PURE__ */ React.createElement("div", { className: "meta" }, /* @__PURE__ */ React.createElement("b", null, group.files.length), " identical copies \xB7 ", formatBytes(group.size), " each"), /* @__PURE__ */ React.createElement("div", { className: "meta" }, purgeCount, " marked \xB7 reclaim ", /* @__PURE__ */ React.createElement("b", null, formatBytes(group.size * purgeCount)))), group.files.map((f) => /* @__PURE__ */ React.createElement(FileRow, { key: f.path, file: f, onSet: (keep) => onSet(group.id, f.path, keep) })));
}
function App() {
  const [folder, setFolder] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState(null);
  const [purging, setPurging] = useState(false);
  const toastTimer = useRef(0);
  useEffect(() => window.api.onScanProgress(setProgress), []);
  const flash = useCallback((msg, kind) => {
    setToast({ msg, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  async function pick() {
    const f = await window.api.pickFolder();
    if (f) {
      setFolder(f);
      setResult(null);
      setGroups([]);
      setPhase("idle");
    }
  }
  async function scan() {
    if (!folder) {
      flash("Pick a folder first.", "warn");
      return;
    }
    setPhase("scanning");
    setProgress(null);
    setResult(null);
    setGroups([]);
    const res = await window.api.scan(folder);
    if (res.error) {
      flash(res.error, "warn");
      setPhase("idle");
      return;
    }
    setResult(res);
    setGroups(res.groups);
    setPhase("done");
    if (!res.groups.length) flash("Clean folder \u2014 no duplicates found. \u2726", "good");
  }
  function setFileKeep(groupId, filePath, keep) {
    setGroups((gs) => gs.map((g) => {
      if (g.id !== groupId) return g;
      const files = g.files.map((f) => f.path === filePath ? { ...f, keep } : f);
      if (!files.some((f) => f.keep)) files[0] = { ...files[0], keep: true };
      return { ...g, files };
    }));
  }
  function bulkKeepNewest() {
    setGroups((gs) => gs.map((g) => {
      const newest = g.files.reduce((a, b) => b.mtime > a.mtime ? b : a, g.files[0]);
      return { ...g, files: g.files.map((f) => ({ ...f, keep: f.path === newest.path })) };
    }));
  }
  function bulkKeepOldest() {
    setGroups((gs) => gs.map((g) => {
      const oldest = g.files.reduce((a, b) => b.mtime < a.mtime ? b : a, g.files[0]);
      return { ...g, files: g.files.map((f) => ({ ...f, keep: f.path === oldest.path })) };
    }));
  }
  const toPurge = groups.flatMap((g) => g.files.filter((f) => !f.keep).map((f) => f.path));
  const reclaimSelected = groups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.keep).length * g.size,
    0
  );
  async function purge() {
    if (!toPurge.length) {
      flash("Nothing marked to purge.", "warn");
      return;
    }
    setPurging(true);
    const res = await window.api.trash(toPurge);
    const removed = new Set(res.removed);
    setGroups((gs) => gs.map((g) => ({ ...g, files: g.files.filter((f) => !removed.has(f.path)) })).filter((g) => g.files.length > 1));
    setPurging(false);
    if (res.failed.length) flash(`Sent ${res.removed.length} to Recycle Bin \xB7 ${res.failed.length} failed.`, "warn");
    else flash(`Sent ${res.removed.length} copies to the Recycle Bin. \u267B`, "good");
  }
  const scanning = phase === "scanning";
  const pct = progress && progress.phase === "hash" && progress.total ? Math.round(progress.done / progress.total * 100) : null;
  return /* @__PURE__ */ React.createElement("div", { className: "shell" }, /* @__PURE__ */ React.createElement(TitleBar, null), /* @__PURE__ */ React.createElement("div", { className: "body" }, /* @__PURE__ */ React.createElement("div", { className: "hero enter d1" }, /* @__PURE__ */ React.createElement("h1", null, "Purge the duplicates."), /* @__PURE__ */ React.createElement("p", null, "Point DupeNova at a folder. It reads every file by content \u2014 not just by name \u2014 so only true byte-for-byte copies get flagged. Removed files go to the Recycle Bin, never straight to the void.")), /* @__PURE__ */ React.createElement("div", { className: "picker enter d2" }, /* @__PURE__ */ React.createElement("div", { className: "folder-field" }, /* @__PURE__ */ React.createElement("span", { className: "ico" }, /* @__PURE__ */ React.createElement(Icon.folder, { width: "18", height: "18" })), /* @__PURE__ */ React.createElement("span", { className: "txt" + (folder ? "" : " empty") }, folder || "No folder chosen yet")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", onClick: pick, disabled: scanning || purging }, /* @__PURE__ */ React.createElement(Icon.folder, null), " Choose folder"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-cyan", onClick: scan, disabled: !folder || scanning || purging }, /* @__PURE__ */ React.createElement(Icon.scan, null), " ", scanning ? "Scanning\u2026" : "Scan for duplicates")), result && /* @__PURE__ */ React.createElement("div", { className: "stats enter d3" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "num cyan" }, result.scanned), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, "files scanned")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "num violet" }, groups.length), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, "duplicate sets")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "num magenta" }, groups.reduce((s, g) => s + g.files.length - 1, 0)), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, "extra copies")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "num cyan" }, formatBytes(reclaimSelected)), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, "reclaim if purged"))), scanning && /* @__PURE__ */ React.createElement("div", { className: "progress-wrap enter" }, /* @__PURE__ */ React.createElement("div", { className: "progress-line" }, /* @__PURE__ */ React.createElement("span", { className: "spinner" }), progress ? progress.phase === "hash" ? `Comparing contents\u2026 ${progress.done}/${progress.total}` : `Mapping files\u2026 ${progress.count}` : "Starting\u2026"), /* @__PURE__ */ React.createElement("div", { className: "bar" }, /* @__PURE__ */ React.createElement("i", { style: { width: (pct != null ? pct : 12) + "%" } }))), phase === "done" && groups.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "results enter" }, /* @__PURE__ */ React.createElement("div", { className: "results-head" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, "DUPLICATE SETS"), /* @__PURE__ */ React.createElement("div", { className: "bulk" }, /* @__PURE__ */ React.createElement("button", { onClick: bulkKeepNewest }, "Keep newest in each"), /* @__PURE__ */ React.createElement("button", { onClick: bulkKeepOldest }, "Keep oldest in each"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-purge",
      onClick: purge,
      disabled: purging || !toPurge.length,
      style: { padding: "7px 14px", fontSize: "12.5px" }
    },
    /* @__PURE__ */ React.createElement(Icon.trash, null),
    " ",
    purging ? "Purging\u2026" : `Purge ${toPurge.length} \u2192 Recycle Bin`
  ))), groups.map((g, i) => /* @__PURE__ */ React.createElement(Group, { key: g.id, group: g, index: i, onSet: setFileKeep }))), phase === "done" && groups.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "placeholder enter" }, /* @__PURE__ */ React.createElement("div", { className: "ring" }, /* @__PURE__ */ React.createElement(Icon.layers, null)), /* @__PURE__ */ React.createElement("h2", null, "NOTHING TO PURGE"), /* @__PURE__ */ React.createElement("p", null, "Every file in this folder is unique. Pick another folder to keep hunting.")), phase === "idle" && !result && /* @__PURE__ */ React.createElement("div", { className: "placeholder enter d4" }, /* @__PURE__ */ React.createElement("div", { className: "ring" }, /* @__PURE__ */ React.createElement(Icon.scan, null)), /* @__PURE__ */ React.createElement("h2", null, "READY WHEN YOU ARE"), /* @__PURE__ */ React.createElement("p", null, "Choose a folder above, then run a scan. DupeNova searches every subfolder and compares files by their actual contents."))), /* @__PURE__ */ React.createElement("div", { className: "toast" + (toast ? " show " + (toast.kind || "") : "") }, toast ? toast.msg : ""));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
