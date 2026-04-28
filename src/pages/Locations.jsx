import { useState, useEffect } from 'react';
import { Icon, ICONS } from '../components/common';
import { formatSize } from '../utils';

const HISTORY_KEY = 'sweepr-scan-history';
const SAVED_KEY   = 'sweepr-saved-dirs';
const DRIVES_CACHE_KEY = 'sweepr-drives-cache';

const DRIVE_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316'];

function useDrives() {
  const [drives,  setDrives]  = useState(() => {
    try { const c = sessionStorage.getItem(DRIVES_CACHE_KEY); return c ? JSON.parse(c) : []; }
    catch { return []; }
  });
  const [loading, setLoading] = useState(() => !sessionStorage.getItem(DRIVES_CACHE_KEY));

  const refresh = async () => {
    setLoading(true);
    try {
      const data = (await window.sweepr.getDrives()) || [];
      setDrives(data);
      sessionStorage.setItem(DRIVES_CACHE_KEY, JSON.stringify(data));
    } catch { setDrives([]); }
    setLoading(false);
  };

  useEffect(() => { if (!sessionStorage.getItem(DRIVES_CACHE_KEY)) refresh(); }, []);
  return { drives, loading, refresh };
}

// ─── Donut chart ─────────────────────────────────────────────────────────────

function DonutChart({ segments, totalSize, usedSize }) {
  const R = 54, STROKE = 8, SIZE = 140, cx = 70, cy = 70;
  const circ = 2 * Math.PI * R;
  const GAP  = 4;

  let accumulated = 0;
  const arcs = segments.map(seg => {
    const fraction = seg.size / totalSize;
    const len    = Math.max(0, fraction * circ - GAP);
    const offset = circ * 0.25 - accumulated * circ;
    accumulated += fraction;
    return { ...seg, len, offset };
  });

  const usedPct = totalSize > 0 ? Math.round((usedSize / totalSize) * 100) : 0;

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 origin-center">
        <circle cx={cx} cy={cy} r={R} fill="none"
          className="stroke-gray-100 dark:stroke-slate-800" strokeWidth={STROKE} />
        {arcs.map((arc, i) => (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none"
            stroke={arc.color} strokeWidth={STROKE}
            strokeDasharray={`${arc.len} ${circ}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round" />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-base font-medium text-gray-900 dark:text-white tracking-tight">{formatSize(usedSize)}</span>
        <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{usedPct}% used</span>
      </div>
    </div>
  );
}

function StorageOverview({ drives }) {
  const segments  = drives.map((d, i) => ({ ...d, color: DRIVE_COLORS[i % DRIVE_COLORS.length] }));
  const totalSize = drives.reduce((s, d) => s + d.size, 0);
  const usedSize  = drives.reduce((s, d) => s + d.used, 0);
  const freeSize  = totalSize - usedSize;

  if (drives.length === 0) return null;

  return (
    <div className="flex items-center gap-8">
      <div className="shrink-0">
        <DonutChart segments={segments} totalSize={totalSize} usedSize={usedSize} />
      </div>

      <div className="flex flex-col gap-4 min-w-[240px]">
        <div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">Total Capacity</p>
          <p className="text-2xl font-medium text-gray-900 dark:text-white tracking-tight">{formatSize(totalSize)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-gray-600 dark:text-slate-300">{formatSize(usedSize)} Used</span>
              <span className="text-gray-500 dark:text-slate-400">{totalSize > 0 ? Math.round((usedSize / totalSize) * 100) : 0}%</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(usedSize / totalSize) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-gray-600 dark:text-slate-300">{formatSize(freeSize)} Free</span>
              <span className="text-gray-500 dark:text-slate-400">{totalSize > 0 ? Math.round((freeSize / totalSize) * 100) : 0}%</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-300 dark:bg-slate-600 rounded-full" style={{ width: `${(freeSize / totalSize) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 pl-8 border-l border-gray-100 dark:border-slate-800/60">
        {segments.map(seg => {
          const pct   = seg.size > 0 ? Math.round((seg.size / totalSize) * 100) : 0;
          const label = seg.volumeName ? `${seg.volumeName} (${seg.name})` : seg.name;
          return (
            <div key={seg.name} className="bg-transparent border border-gray-100 dark:border-slate-800/60 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-[11px] font-medium text-gray-700 dark:text-slate-300 truncate">{label}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500 mt-1">
                <span>{formatSize(seg.size)}</span>
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drive row ────────────────────────────────────────────────────────────────

function DriveRow({ drive, color, onScan }) {
  const pct      = drive.size > 0 ? Math.round(drive.used / drive.size * 100) : 0;
  const label    = drive.volumeName ? `${drive.volumeName} (${drive.name})` : drive.name;
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : color;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-slate-800/40 last:border-0 group">
      <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
        <Icon d={ICONS.drive} size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate">{label}</span>
            {drive.fileSystem && <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase">{drive.fileSystem}</span>}
          </div>
          <span className="text-[11px] text-gray-500 dark:text-slate-400 shrink-0 tabular-nums">
            {formatSize(drive.used)} / {formatSize(drive.size)}
          </span>
        </div>
        <div className="h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5 w-full max-w-xs">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{formatSize(drive.free)} free</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => window.sweepr.openInExplorer(drive.path)} title="Open in Explorer"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <Icon d={ICONS.open} size={13} />
        </button>
        <button onClick={() => onScan(drive.path)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-300 text-xs transition-colors rounded-lg">
          <Icon d={ICONS.play} size={11} />
          Scan
        </button>
      </div>
    </div>
  );
}

// ─── Scan history row ─────────────────────────────────────────────────────────

function ScanRow({ entry, onScan }) {
  const folderName = entry.path.split(/[/\\]/).filter(Boolean).pop() || entry.path;
  const date = entry.scannedAt
    ? new Date(entry.scannedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-slate-800/40 last:border-0 group">
      <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
        <Icon d={ICONS.folder} size={14} className="text-gray-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate" title={entry.path}>{folderName}</p>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-500 mt-0.5">
          <span className="truncate max-w-[150px] xl:max-w-[200px]">{entry.path}</span>
          {entry.totalSize > 0 && <><span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0" /><span>{formatSize(entry.totalSize)}</span></>}
          {entry.totalFiles > 0 && <><span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0" /><span>{entry.totalFiles.toLocaleString()} items</span></>}
          {date && <><span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0" /><span>{date}</span></>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => window.sweepr.openInExplorer(entry.path)} title="Open in Explorer"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <Icon d={ICONS.open} size={13} />
        </button>
        <button onClick={() => onScan(entry.path)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-300 text-xs transition-colors rounded-lg">
          <Icon d={ICONS.play} size={11} />
          Scan
        </button>
      </div>
    </div>
  );
}

// ─── Saved directory row ──────────────────────────────────────────────────────

function SavedRow({ path, onScan, onRemove }) {
  const folderName = path.split(/[/\\]/).filter(Boolean).pop() || path;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-slate-800/40 last:border-0 group">
      <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700/50 bg-blue-50/50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
        <Icon d={ICONS.folder} size={14} className="text-blue-500 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate" title={path}>{folderName}</p>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate max-w-[200px]">{path}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => window.sweepr.openInExplorer(path)} title="Open in Explorer"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <Icon d={ICONS.open} size={13} />
        </button>
        <button onClick={() => onScan(path)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-300 text-xs transition-colors rounded-lg">
          <Icon d={ICONS.play} size={11} />
          Scan
        </button>
        <button onClick={() => onRemove(path)} title="Remove"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <Icon d={ICONS.x} size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LocationsPage({ onQuickScan }) {
  const { drives, loading, refresh } = useDrives();

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
    catch { return []; }
  });
  const [rightTab, setRightTab] = useState('recent');

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };

  const addSaved = async () => {
    const p = await window.sweepr.selectFolder();
    if (!p) return;
    setSaved(prev => {
      if (prev.includes(p)) return prev;
      const next = [p, ...prev];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeSaved = (path) => {
    setSaved(prev => {
      const next = prev.filter(p => p !== path);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Locations</h1>
          <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">Manage your storage locations and view recent scans.</p>
        </div>
        <button onClick={refresh}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 dark:text-slate-400
                     hover:text-gray-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50">
          <Icon d={ICONS.refresh} size={12} />
          Refresh
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Storage Overview */}
        <div className="shrink-0 px-6 py-6 border-b border-gray-100 dark:border-slate-800/60">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-[13px] text-gray-400 dark:text-slate-500">Loading storage data...</span>
            </div>
          ) : (
            <StorageOverview drives={drives} />
          )}
        </div>

        {/* Bottom: Drives & Right Panel */}
        <div className="flex-1 grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-800/60 min-h-0">

          {/* ── Drives ── */}
          <div className="flex flex-col overflow-hidden">
            <div className="shrink-0 px-6 py-4 border-b border-gray-50 dark:border-slate-800/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
                <Icon d={ICONS.drive} size={14} className="text-gray-500 dark:text-slate-400" />
              </div>
              <div>
                <h2 className="text-[13px] font-medium text-gray-900 dark:text-white tracking-tight">Local Drives</h2>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Physical disks and partitions attached.</p>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-6 py-2">
              {!loading && drives.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-[13px] text-gray-400 dark:text-slate-500">No drives found</div>
              ) : (
                drives.map((drive, i) => (
                  <DriveRow key={drive.name} drive={drive} color={DRIVE_COLORS[i % DRIVE_COLORS.length]} onScan={onQuickScan} />
                ))
              )}
            </div>
          </div>

          {/* ── Right Panel (Tabbed) ── */}
          <div className="flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="shrink-0 px-6 py-0 border-b border-gray-50 dark:border-slate-800/40 flex items-center justify-between">
              <div className="flex">
                {[['recent', 'Recent Scans'], ['saved', 'Saved']].map(([id, label]) => (
                  <button key={id} onClick={() => setRightTab(id)}
                    className={`px-4 py-4 text-[12px] font-medium border-b-2 transition-colors ${
                      rightTab === id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}>
                    {label}
                    {id === 'saved' && saved.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full">
                        {saved.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {rightTab === 'recent' && history.length > 0 && (
                <button onClick={clearHistory}
                  className="px-2 py-1 text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors rounded hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  Clear
                </button>
              )}
              {rightTab === 'saved' && (
                <button onClick={addSaved}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Icon d={ICONS.plus} size={11} />
                  Add
                </button>
              )}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto px-6 py-2">
              {rightTab === 'recent' ? (
                history.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-[13px] text-gray-400 dark:text-slate-500">No recent scans yet</div>
                ) : (
                  history.map(entry => (
                    <ScanRow key={entry.path} entry={entry} onScan={onQuickScan} />
                  ))
                )
              ) : (
                saved.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-3">
                    <p className="text-[13px] text-gray-400 dark:text-slate-500">No saved directories yet</p>
                    <button onClick={addSaved}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-medium rounded-lg transition-colors">
                      <Icon d={ICONS.plus} size={12} />
                      Add Directory
                    </button>
                  </div>
                ) : (
                  saved.map(path => (
                    <SavedRow key={path} path={path} onScan={onQuickScan} onRemove={removeSaved} />
                  ))
                )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/30 dark:bg-slate-900/10">
        <span className="text-[13px] grayscale opacity-80">💡</span>
        <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
          Drive data is cached for the session. Click <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-700 dark:text-slate-300 mx-0.5">Refresh</span> to reload. Use <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-700 dark:text-slate-300 mx-0.5">Saved</span> to pin directories for quick access.
        </p>
      </div>

    </div>
  );
}
