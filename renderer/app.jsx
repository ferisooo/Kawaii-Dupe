'use strict';

/* DupeNova UI.
   React + ReactDOM are loaded as globals from renderer/vendor (UMD).
   This file is the readable source; esbuild compiles it to app.js. */

const { useState, useEffect, useRef, useCallback } = React;

/* -------------------------------- helpers -------------------------------- */

function formatBytes(n) {
  if (!n) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + u[i];
}

/* tiny inline icons */
const Icon = {
  folder: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  scan: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m1 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5" />
    </svg>
  )
};

/* ------------------------------- titlebar -------------------------------- */

function TitleBar() {
  const [max, setMax] = useState(false);
  useEffect(() => window.api.onMaximizeChange(setMax), []);
  return (
    <div className="titlebar">
      <div className="brand">
        <span className="mark" />
        <span className="glow-text">DUPENOVA</span>
        <span className="tag">duplicate purifier</span>
      </div>
      <div className="win-controls">
        <button className="win-btn" title="Minimize" onClick={() => window.api.minimize()}>
          <svg viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
        <button className="win-btn" title={max ? 'Restore' : 'Maximize'} onClick={() => window.api.maximizeToggle()}>
          {max
            ? <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="1.5" width="6" height="6" /><rect x="1.5" y="3.5" width="6" height="6" fill="var(--void)" /></svg>
            : <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="2" width="8" height="8" /></svg>}
        </button>
        <button className="win-btn close" title="Close" onClick={() => window.api.close()}>
          <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- file row ------------------------------- */

function FileRow({ file, onSet }) {
  return (
    <div className="file-row">
      <span className={'dot ' + (file.keep ? 'keep' : 'purge')} />
      <div className="file-info" onDoubleClick={() => window.api.reveal(file.path)} title="Double-click to reveal in Explorer">
        <div className="fname">{file.name}</div>
        <div className="fpath">{file.dir}</div>
      </div>
      <div className="row-actions">
        <button className={'chip ' + (file.keep ? 'active-keep' : '')} onClick={() => onSet(true)}>Keep</button>
        <button className={'chip ' + (!file.keep ? 'active-purge' : '')} onClick={() => onSet(false)}>Purge</button>
      </div>
    </div>
  );
}

/* ------------------------------ group card ------------------------------- */

function Group({ group, index, onSet, collapsing }) {
  const purgeCount = group.files.filter((f) => !f.keep).length;
  return (
    <div className={'group' + (collapsing ? ' collapsing' : '')} style={{ animationDelay: Math.min(index * 0.04, 0.5) + 's' }}>
      <div className="group-head">
        <div className="meta">
          <b>{group.files.length}</b> identical copies · {formatBytes(group.size)} each
        </div>
        <div className="meta">{purgeCount} marked · reclaim <b>{formatBytes(group.size * purgeCount)}</b></div>
      </div>
      {group.files.map((f) => (
        <FileRow key={f.path} file={f} onSet={(keep) => onSet(group.id, f.path, keep)} />
      ))}
    </div>
  );
}

/* --------------------------------- app ----------------------------------- */

function App() {
  const [folder, setFolder] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | scanning | done
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
    if (f) { setFolder(f); setResult(null); setGroups([]); setPhase('idle'); }
  }

  async function scan() {
    if (!folder) { flash('Pick a folder first.', 'warn'); return; }
    setPhase('scanning'); setProgress(null); setResult(null); setGroups([]);
    const res = await window.api.scan(folder);
    if (res.error) { flash(res.error, 'warn'); setPhase('idle'); return; }
    setResult(res);
    setGroups(res.groups);
    setPhase('done');
    if (!res.groups.length) flash('Clean folder — no duplicates found. ✦', 'good');
  }

  function setFileKeep(groupId, filePath, keep) {
    setGroups((gs) => gs.map((g) => {
      if (g.id !== groupId) return g;
      const files = g.files.map((f) => f.path === filePath ? { ...f, keep } : f);
      // never let a group have zero kept files
      if (!files.some((f) => f.keep)) files[0] = { ...files[0], keep: true };
      return { ...g, files };
    }));
  }

  function bulkKeepNewest() {
    setGroups((gs) => gs.map((g) => {
      const newest = g.files.reduce((a, b) => (b.mtime > a.mtime ? b : a), g.files[0]);
      return { ...g, files: g.files.map((f) => ({ ...f, keep: f.path === newest.path })) };
    }));
  }
  function bulkKeepOldest() {
    setGroups((gs) => gs.map((g) => {
      const oldest = g.files.reduce((a, b) => (b.mtime < a.mtime ? b : a), g.files[0]);
      return { ...g, files: g.files.map((f) => ({ ...f, keep: f.path === oldest.path })) };
    }));
  }

  const toPurge = groups.flatMap((g) => g.files.filter((f) => !f.keep).map((f) => f.path));
  const reclaimSelected = groups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.keep).length * g.size, 0);

  async function purge() {
    if (!toPurge.length) { flash('Nothing marked to purge.', 'warn'); return; }
    setPurging(true);
    const res = await window.api.trash(toPurge);
    const removed = new Set(res.removed);
    // drop removed files; drop groups that no longer have duplicates
    setGroups((gs) => gs
      .map((g) => ({ ...g, files: g.files.filter((f) => !removed.has(f.path)) }))
      .filter((g) => g.files.length > 1));
    setPurging(false);
    if (res.failed.length) flash(`Sent ${res.removed.length} to Recycle Bin · ${res.failed.length} failed.`, 'warn');
    else flash(`Sent ${res.removed.length} copies to the Recycle Bin. ♻`, 'good');
  }

  const scanning = phase === 'scanning';
  const pct = progress && progress.phase === 'hash' && progress.total
    ? Math.round((progress.done / progress.total) * 100) : null;

  return (
    <div className="shell">
      <TitleBar />
      <div className="body">

        <div className="hero enter d1">
          <h1>Purge the duplicates.</h1>
          <p>Point DupeNova at a folder. It reads every file by content — not just by name — so only true byte-for-byte copies get flagged. Removed files go to the Recycle Bin, never straight to the void.</p>
        </div>

        <div className="picker enter d2">
          <div className="folder-field">
            <span className="ico"><Icon.folder width="18" height="18" /></span>
            <span className={'txt' + (folder ? '' : ' empty')}>{folder || 'No folder chosen yet'}</span>
          </div>
          <button className="btn btn-ghost" onClick={pick} disabled={scanning || purging}>
            <Icon.folder /> Choose folder
          </button>
          <button className="btn btn-cyan" onClick={scan} disabled={!folder || scanning || purging}>
            <Icon.scan /> {scanning ? 'Scanning…' : 'Scan for duplicates'}
          </button>
        </div>

        {result && (
          <div className="stats enter d3">
            <div className="stat"><div className="num cyan">{result.scanned}</div><div className="lbl">files scanned</div></div>
            <div className="stat"><div className="num violet">{groups.length}</div><div className="lbl">duplicate sets</div></div>
            <div className="stat"><div className="num magenta">{groups.reduce((s, g) => s + g.files.length - 1, 0)}</div><div className="lbl">extra copies</div></div>
            <div className="stat"><div className="num cyan">{formatBytes(reclaimSelected)}</div><div className="lbl">reclaim if purged</div></div>
          </div>
        )}

        {scanning && (
          <div className="progress-wrap enter">
            <div className="progress-line">
              <span className="spinner" />
              {progress ? (progress.phase === 'hash'
                ? `Comparing contents… ${progress.done}/${progress.total}`
                : `Mapping files… ${progress.count}`) : 'Starting…'}
            </div>
            <div className="bar"><i style={{ width: (pct != null ? pct : 12) + '%' }} /></div>
          </div>
        )}

        {phase === 'done' && groups.length > 0 && (
          <div className="results enter">
            <div className="results-head">
              <div className="title">DUPLICATE SETS</div>
              <div className="bulk">
                <button onClick={bulkKeepNewest}>Keep newest in each</button>
                <button onClick={bulkKeepOldest}>Keep oldest in each</button>
                <button className="btn btn-purge" onClick={purge} disabled={purging || !toPurge.length}
                        style={{ padding: '7px 14px', fontSize: '12.5px' }}>
                  <Icon.trash /> {purging ? 'Purging…' : `Purge ${toPurge.length} → Recycle Bin`}
                </button>
              </div>
            </div>
            {groups.map((g, i) => (
              <Group key={g.id} group={g} index={i} onSet={setFileKeep} />
            ))}
          </div>
        )}

        {phase === 'done' && groups.length === 0 && (
          <div className="placeholder enter">
            <div className="ring"><Icon.layers /></div>
            <h2>NOTHING TO PURGE</h2>
            <p>Every file in this folder is unique. Pick another folder to keep hunting.</p>
          </div>
        )}

        {phase === 'idle' && !result && (
          <div className="placeholder enter d4">
            <div className="ring"><Icon.scan /></div>
            <h2>READY WHEN YOU ARE</h2>
            <p>Choose a folder above, then run a scan. DupeNova searches every subfolder and compares files by their actual contents.</p>
          </div>
        )}
      </div>

      <div className={'toast' + (toast ? ' show ' + (toast.kind || '') : '')}>
        {toast ? toast.msg : ''}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
