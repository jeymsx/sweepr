import { useState } from 'react';
import {
  Icon, ICONS, Spinner, CircularProgress, SizeInput, SortDropdown,
  DeleteModal, FileRow, FileCard,
} from '../components/common';
import { formatSize, formatClock, PAGE_SIZE } from '../utils';

// ─── Filter Modal ─────────────────────────────────────────────────────────────

function FilterModal({ onClose, postExtChips, setPostExtChips, availableExts,
                       includeFolders, setIncludeFolders,
                       postMinSize, setPostMinSize, postMaxSize, setPostMaxSize,
                       postDateFrom, setPostDateFrom, postDateTo, setPostDateTo, setPage }) {
  const [extSearch, setExtSearch] = useState('');
  const hasFilters = postExtChips.size > 0 || postMinSize || postMaxSize || postDateFrom || postDateTo || includeFolders;

  const clearAll = () => {
    setPostExtChips(new Set());
    setIncludeFolders(false);
    setPostMinSize(''); setPostMaxSize('');
    setPostDateFrom(''); setPostDateTo('');
    setPage(0);
  };

  const toggleChip = (ext) => {
    setPostExtChips(prev => {
      const next = new Set(prev);
      next.has(ext) ? next.delete(ext) : next.add(ext);
      return next;
    });
    setPage(0);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-24 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-[#2e3449] rounded-2xl p-5 w-full max-w-lg mx-4 shadow-xl"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium text-gray-900 dark:text-white text-[15px]">Filter Results</h3>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button onClick={clearAll} className="text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                Clear All
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <Icon d={ICONS.x} size={16} />
            </button>
          </div>
        </div>

        {/* File type chips */}
        {availableExts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
                File Types
                {postExtChips.size > 0 && (
                  <span className="ml-1.5 text-blue-500">{postExtChips.size} selected</span>
                )}
              </label>
            </div>
            <div className="relative mb-2">
              <Icon d={ICONS.search} size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={extSearch} onChange={e => setExtSearch(e.target.value)}
                placeholder="Search file types..."
                className="w-full pl-7 pr-2.5 py-1.5 text-[11px] bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                           rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-900 dark:text-slate-200
                           hover:border-gray-300 dark:hover:border-slate-600 transition-shadow" />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
              {availableExts
                .filter(ext => !extSearch || ext.toLowerCase().includes(extSearch.toLowerCase()))
                .map(ext => {
                  const label = ext.length > 10 ? ext.slice(0, 10) + '…' : ext;
                  return (
                    <button key={ext} onClick={() => toggleChip(ext)} title={ext}
                      className={`px-3 py-1 text-xs rounded-md border font-mono transition-colors ${
                        postExtChips.has(ext)
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                          : 'bg-transparent text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}>
                      {label}
                    </button>
                  );
                })}
              {availableExts.filter(ext => !extSearch || ext.toLowerCase().includes(extSearch.toLowerCase())).length === 0 && (
                <span className="text-[11px] text-gray-400 dark:text-slate-500 py-1">No types match "{extSearch}"</span>
              )}
            </div>
          </div>
        )}

        {/* Include folders */}
        <div className="flex items-center justify-between py-3 border-t border-gray-50 dark:border-slate-800/40 mb-1">
          <div>
            <p className="text-[13px] font-medium text-gray-800 dark:text-slate-200">Include Folders</p>
            <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-0.5">Show parent folders with summed sizes</p>
          </div>
          <button onClick={() => { setIncludeFolders(!includeFolders); setPage(0); }}
            role="switch" aria-checked={includeFolders}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ease-in-out shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
              includeFolders ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'
            }`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              includeFolders ? 'translate-x-[18px]' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Size range */}
        <div className="py-3 border-t border-gray-50 dark:border-slate-800/40">
          <label className="block text-[11px] font-medium text-gray-500 dark:text-slate-400 mb-2">
            File Size
          </label>
          <div className="flex items-center gap-3">
            <input value={postMinSize} onChange={e => { setPostMinSize(e.target.value); setPage(0); }}
              placeholder="Min (e.g. 100MB)"
              className="flex-1 h-8 px-3 text-xs bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600
                         text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow" />
            <span className="text-gray-400 dark:text-slate-500 text-sm shrink-0">—</span>
            <input value={postMaxSize} onChange={e => { setPostMaxSize(e.target.value); setPage(0); }}
              placeholder="Max (e.g. 5GB)"
              className="flex-1 h-8 px-3 text-xs bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600
                         text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow" />
          </div>
        </div>

        {/* Date range */}
        <div className="pt-3 border-t border-gray-50 dark:border-slate-800/40">
          <label className="block text-[11px] font-medium text-gray-500 dark:text-slate-400 mb-2">
            Date Modified
          </label>
          <div className="flex items-center gap-3">
            <input type="date" value={postDateFrom} onChange={e => { setPostDateFrom(e.target.value); setPage(0); }}
              className="flex-1 h-8 px-3 text-xs bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600
                         text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow" />
            <span className="text-gray-400 dark:text-slate-500 text-sm shrink-0">—</span>
            <input type="date" value={postDateTo} onChange={e => { setPostDateTo(e.target.value); setPage(0); }}
              className="flex-1 h-8 px-3 text-xs bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600
                         text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category sidebar styles ─────────────────────────────────────────────────

const CAT_STYLE = {
  Images:      { bg: 'bg-emerald-50 dark:bg-emerald-500/10',     fg: 'text-emerald-500', sym: '⬡' },
  Videos:      { bg: 'bg-purple-50 dark:bg-purple-500/10',       fg: 'text-purple-500',  sym: '▶' },
  Documents:   { bg: 'bg-blue-50 dark:bg-blue-500/10',           fg: 'text-blue-500',    sym: 'W' },
  Archives:    { bg: 'bg-amber-50 dark:bg-amber-500/10',         fg: 'text-amber-500',   sym: '⊞' },
  Executables: { bg: 'bg-orange-50 dark:bg-orange-500/10',       fg: 'text-orange-500',  sym: '⚙' },
  Audio:       { bg: 'bg-pink-50 dark:bg-pink-500/10',           fg: 'text-pink-500',    sym: '♪' },
  Others:      { bg: 'bg-gray-50 dark:bg-slate-700/30',          fg: 'text-gray-500',    sym: '◻' },
};

// ─── Scanner page ─────────────────────────────────────────────────────────────

export default function ScannerPage(p) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const percent  = p.scanProgress
    ? Math.max(1, Math.min(Math.round(p.scanProgress.dirsProcessed / Math.max(1, p.scanProgress.dirsQueued) * 100), 95))
    : 0;
  const elapsed  = p.scanProgress ? p.scanProgress.elapsedMs / 1000 : 0;
  const fps      = p.scanProgress?.filesPerSec ?? 0;
  const eta      = p.scanProgress?.eta ?? null;
  const lastDir  = p.scanProgress?.lastDir ?? '';

  const Th = ({ label, col, className = '' }) => {
    const [sk, sd] = p.sortOption.split('|');
    const active   = sk === col;
    return (
      <th onClick={() => { p.onSortChange(`${col}|${active && sd === 'desc' ? 'asc' : 'desc'}`); p.setPage(0); }}
        className={`px-3 py-2 text-left text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide
                    cursor-pointer hover:text-gray-800 dark:hover:text-slate-200 select-none transition-colors ${className}`}>
        {label}
        {active  && <span className="ml-1 text-blue-500">{sd === 'asc' ? '↑' : '↓'}</span>}
      </th>
    );
  };

  const resultFiles   = p.isScanning ? p.topFiles : p.pageFiles;
  const showResults   = p.scanDone || (p.isScanning && p.topFiles.length > 0);
  const filterActive  = p.postExtChips.size > 0 || p.includeFolders || p.postMinSize || p.postMaxSize || p.postDateFrom || p.postDateTo;
  const filterCount   = p.postExtChips.size + (p.includeFolders ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Scanner</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          Configure your scan targets and filtering rules.
        </p>
      </div>

      {/* ── Main Scrollable Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Control Section (Split layout) */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-slate-800/60 border-b border-gray-100 dark:border-slate-800/60">
          
          {/* Target Location */}
          <div className="lg:col-span-5 px-6 py-4 flex flex-col justify-center gap-2">
            <p className="text-[10px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Target Location</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <Icon d={ICONS.folder} size={14} className="text-blue-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                {p.folderPath ? (
                  <button onClick={() => window.sweepr.openInExplorer(p.folderPath)} title="Open in Explorer"
                    className="text-[12px] font-medium text-gray-800 dark:text-slate-200 hover:text-blue-500 transition-colors truncate text-left block w-full">
                    {p.folderPath}
                  </button>
                ) : (
                  <button onClick={p.onSelectFolder} disabled={p.isScanning}
                    className="text-[12px] font-medium text-gray-400 hover:text-blue-500 transition-colors truncate text-left block w-full">
                    Select a folder to scan...
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 border-l border-gray-100 dark:border-slate-800/60 pl-3">
                <button onClick={p.onSelectFolder} disabled={p.isScanning}
                  className="flex items-center justify-center px-2.5 h-8 text-[11px] font-medium bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-600 dark:text-slate-300 rounded-md transition-colors disabled:opacity-50">
                  Browse
                </button>
                
                <button onClick={() => p.onScan()} disabled={!p.folderPath || p.isScanning}
                  className="flex items-center justify-center px-3 h-8 text-[11px] font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50">
                  Scan
                </button>

                {p.scanDone && (
                  <button onClick={() => p.onScan()} disabled={p.isScanning}
                    className="flex items-center justify-center px-2.5 h-8 text-[11px] font-medium bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-600 dark:text-slate-300 rounded-md transition-colors">
                    Rescan
                  </button>
                )}

                {p.isScanning && (
                  <button onClick={p.onCancelScan}
                    className="flex items-center justify-center px-2.5 h-8 text-[11px] font-medium bg-transparent border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md transition-colors">
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pre-Scan Filters */}
          <div className="lg:col-span-7 px-6 py-4 flex flex-col justify-center gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pre-Scan Filters</p>
              <button onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[10px] font-medium text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1">
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                <Icon d={showAdvanced ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} size={9} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1.5">File Types</label>
                <input value={p.preExt} onChange={e => p.setPreExt(e.target.value)} placeholder=".mp4, .zip"
                  className="w-28 h-8 px-2.5 text-[11px] bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1.5">Min Size</label>
                <SizeInput value={p.preMinVal} unit={p.preMinUnit} onValue={p.setPreMinVal} onUnit={p.setPreMinUnit} placeholder="100" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1.5">Max Size</label>
                <SizeInput value={p.preMaxVal} unit={p.preMaxUnit} onValue={p.setPreMaxVal} onUnit={p.setPreMaxUnit} placeholder="5" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1.5">Date Modified</label>
                <div className="flex items-center gap-1.5">
                  <input type="date" value={p.preDateFrom} onChange={e => p.setPreDateFrom(e.target.value)}
                    className="h-8 px-2 text-[11px] bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow" />
                  <span className="text-gray-300 dark:text-slate-600 text-xs">—</span>
                  <input type="date" value={p.preDateTo} onChange={e => p.setPreDateTo(e.target.value)}
                    className="h-8 px-2 text-[11px] bg-transparent border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow" />
                </div>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="pt-3 mt-1.5 flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-50 dark:border-slate-800/40">
                {[['Include hidden files', false], ['Skip system folders', true], ['Follow symlinks', false]].map(([label, checked]) => (
                  <label key={label} className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked={checked} className="accent-blue-500 rounded-sm" />
                    {label}
                  </label>
                ))}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Max depth:</span>
                  <input type="number" min="1" max="99" placeholder="∞"
                    className="w-12 h-6 px-1.5 text-[10px] bg-transparent border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded focus:outline-none focus:border-gray-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Exclude:</span>
                  <input type="text" placeholder="*.tmp, ~*"
                    className="w-24 h-6 px-1.5 text-[10px] bg-transparent border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded focus:outline-none focus:border-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scan progress banner */}
        {p.isScanning && (
          <div className="shrink-0 px-6 py-4 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-500/5 flex items-center gap-6 flex-wrap">
            <div className="scale-90 origin-left">
              <CircularProgress percent={percent} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Spinner size={12} />
                <span className="text-[12px] font-medium text-gray-800 dark:text-slate-200">Scanning in progress...</span>
              </div>
              <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 truncate mb-2" title={lastDir}>
                {lastDir || p.folderPath}
              </p>
              <div className="h-1 bg-blue-100 dark:bg-slate-800 rounded-full overflow-hidden w-full max-w-sm">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                ['Files',   (p.scanProgress?.filesScanned ?? 0).toLocaleString()],
                ['Folders', (p.scanProgress?.dirsProcessed ?? 0).toLocaleString()],
                ['Size',    formatSize(p.scanProgress?.totalSize ?? 0)],
                ['Speed',   fps > 0 ? `${fps.toLocaleString()}/s` : '—'],
                ['Elapsed', elapsed > 0 ? formatClock(elapsed) : '—'],
                ['ETA',     eta !== null ? `~${formatClock(eta)}` : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col items-start min-w-[50px]">
                  <span className="text-[9px] font-medium text-gray-400 dark:text-slate-500 mb-0.5 uppercase tracking-wider">{label}</span>
                  <span className="text-[11px] font-medium text-gray-900 dark:text-slate-200 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        {p.scanDone && (
          <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-slate-800/60 border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/20 dark:bg-slate-900/10">
            {[
              { label: 'Total Files',  value: p.stats.totalFiles.toLocaleString(),  iconD: ICONS.results,  cls: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
              { label: 'Total Size',   value: formatSize(p.stats.totalSize),         iconD: ICONS.scanner,  cls: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
              { label: 'Largest File', value: formatSize(p.largestFile?.size ?? 0),  iconD: ICONS.trash,    cls: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', sub: p.largestFile?.name },
              { label: 'Last Scan',
                value: p.lastScanTime ? new Date(p.lastScanTime).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '—',
                sub:   p.lastScanTime ? new Date(p.lastScanTime).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : undefined,
                iconD: ICONS.refresh,  cls: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
            ].map(col => (
              <div key={col.label} className="px-6 py-2.5 flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${col.cls}`}>
                  <Icon d={col.iconD} size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-medium text-gray-500 dark:text-slate-400 mb-0.5 uppercase tracking-wider">{col.label}</p>
                  <p className="text-[12px] font-medium text-gray-900 dark:text-slate-200 leading-tight truncate">{col.value}</p>
                  {col.sub && <p className="text-[9px] text-gray-400 dark:text-slate-500 truncate mt-0.5">{col.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Results Area ── */}
        {showResults ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="shrink-0 px-6 py-2.5 border-b border-gray-50 dark:border-slate-800/40 bg-gray-50/50 dark:bg-slate-900/10 flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Icon d={ICONS.search} size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={p.search} onChange={e => { p.setSearch(e.target.value); p.setPage(0); }}
                  placeholder="Search files..."
                  className="w-48 h-8 pl-7 pr-2.5 text-[11px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200
                             rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:border-gray-300 dark:hover:border-slate-600 transition-shadow" />
              </div>
              
              <button onClick={() => setShowFilterModal(true)}
                className={`flex items-center gap-1.5 h-8 px-2.5 text-[11px] font-medium rounded-md transition-colors border ${
                  filterActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}>
                <Icon d={ICONS.filter} size={11} />
                Filter
                {filterCount > 0 && (
                  <span className="w-3.5 h-3.5 bg-blue-100 dark:bg-blue-500/30 rounded text-[9px] flex items-center justify-center font-medium ml-0.5">{filterCount}</span>
                )}
              </button>

              <div className="flex-1" />
              
              <SortDropdown value={p.sortOption} onChange={v => { p.onSortChange(v); p.setPage(0); }} />
              
              <div className="flex p-0.5 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 h-8">
                {[['list', ICONS.list], ['card', ICONS.grid]].map(([mode, iconD]) => {
                  const isActive = p.viewMode === mode;
                  return (
                    <button key={mode} onClick={() => p.setViewMode(mode)}
                      className={`px-2.5 transition-all duration-200 rounded ${
                        isActive ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                      }`}>
                      <Icon d={iconD} size={11} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {p.error && (
              <div className="shrink-0 mx-6 mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-[12px] font-medium text-red-600 dark:text-red-400">
                <span className="flex-1">{p.error}</span>
                <button onClick={() => p.setError('')} className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"><Icon d={ICONS.x} size={11} /></button>
              </div>
            )}

            {/* Split View: Categories Sidebar + Main Table */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Category sidebar */}
              {p.scanDone && p.fileCategoryStats?.length > 0 && (
                <div className="w-48 shrink-0 border-r border-gray-100 dark:border-slate-800/60 p-4 overflow-y-auto">
                  <p className="text-[10px] font-medium text-gray-500 dark:text-slate-400 mb-3 px-1 uppercase tracking-wider">Categories</p>
                  <div className="flex flex-col gap-1">
                    {p.fileCategoryStats.map(cat => {
                      const s = CAT_STYLE[cat.label] ?? CAT_STYLE.Others;
                      return (
                        <div key={cat.label} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] shrink-0 ${s.bg} ${s.fg}`}>{s.sym}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-gray-800 dark:text-slate-200 truncate">{cat.label}</p>
                            <p className="text-[9px] text-gray-500 dark:text-slate-500">{cat.count.toLocaleString()} items</p>
                          </div>
                          <span className="text-[9px] font-medium text-gray-400 dark:text-slate-500 shrink-0">{formatSize(cat.size)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Table / grid */}
              <div className="flex-1 overflow-auto">
                {p.viewMode === 'list' ? (
                  <table className="w-full text-[12px] border-collapse">
                    <thead className="sticky top-0 z-10 bg-white/95 dark:bg-[#161b27]/95 backdrop-blur-sm shadow-sm">
                      <tr className="border-b border-gray-100 dark:border-slate-800/60">
                        <th className="px-5 py-2.5 w-12 text-center">
                          <input type="checkbox" checked={p.allPageSelected} onChange={p.onToggleSelectAll}
                            disabled={resultFiles.length === 0} className="cursor-pointer accent-blue-500 rounded-sm" />
                        </th>
                        <Th label="Name"     col="name" />
                        <Th label="Size"     col="size"      className="w-24" />
                        <Th label="Modified" col="modified"  className="w-36" />
                        <Th label="Type"     col="extension" className="w-20" />
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide hidden xl:table-cell">Path</th>
                        <th className="w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {resultFiles.map(file => (
                        <FileRow key={file.id} file={file}
                          selected={p.selected.has(file.fullPath)}
                          onToggle={() => p.onToggleSelect(file.fullPath)}
                          onDelete={() => p.onDeleteFile([file.fullPath])} />
                      ))}
                      {resultFiles.length === 0 && p.scanDone && (
                        <tr><td colSpan={7} className="px-6 py-24 text-center text-[12px] font-medium text-gray-400 dark:text-slate-500">No files match the current filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                    {resultFiles.map(file => (
                      <FileCard key={file.id} file={file}
                        selected={p.selected.has(file.fullPath)}
                        onToggle={() => p.onToggleSelect(file.fullPath)}
                        onDelete={() => p.onDeleteFile([file.fullPath])} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination & Footer Bar (Combined to save vertical space) */}
            <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27]">
              
              {/* Left: Selection details & Actions */}
              <div className="flex items-center gap-4">
                <button onClick={() => p.selected.size > 0 && p.onDeleteFile([...p.selected])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors border ${
                    p.selected.size > 0
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20'
                      : 'bg-transparent text-gray-400 border-gray-200 dark:border-slate-700 dark:text-slate-600 cursor-default'
                  }`}>
                  <Icon d={ICONS.trash} size={11} />
                  Delete Selected
                </button>
                {p.selected.size > 0 && (
                  <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
                    <span className="text-gray-900 dark:text-slate-200">{p.selected.size}</span> items selected
                  </span>
                )}
              </div>

              {/* Right: Pagination */}
              {p.scanDone && p.totalPages > 1 && (
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 hidden sm:inline-block">
                    {p.page * PAGE_SIZE + 1}–{Math.min((p.page + 1) * PAGE_SIZE, p.filteredCount)} of {p.filteredCount.toLocaleString()}
                  </span>
                  <div className="flex gap-1.5">
                    {[['«',() => p.setPage(0)],['‹',() => p.setPage(p.page-1)],['›',() => p.setPage(p.page+1)],['»',() => p.setPage(p.totalPages-1)]].map(([sym,fn],i) => (
                      <button key={sym} onClick={fn} disabled={i < 2 ? p.page === 0 : p.page >= p.totalPages - 1}
                        className="px-2.5 py-1 text-[11px] rounded bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-200 dark:border-slate-700">
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          !p.isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-gray-400 dark:text-slate-600 bg-white dark:bg-[#161b27]">
              <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center opacity-50">
                <Icon d={ICONS.scanner} size={24} />
              </div>
              <p className="text-[13px] font-medium text-gray-500 dark:text-slate-500">Select a folder and configure filters to begin scanning.</p>
            </div>
          )
        )}
      </div>

      <DeleteModal modal={p.deleteModal} onConfirm={p.onConfirmDelete} onCancel={p.onCancelDelete} />

      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          postExtChips={p.postExtChips}   setPostExtChips={p.setPostExtChips}
          availableExts={p.availableExts ?? []}
          includeFolders={p.includeFolders} setIncludeFolders={p.setIncludeFolders}
          postMinSize={p.postMinSize}     setPostMinSize={p.setPostMinSize}
          postMaxSize={p.postMaxSize}     setPostMaxSize={p.setPostMaxSize}
          postDateFrom={p.postDateFrom}   setPostDateFrom={p.setPostDateFrom}
          postDateTo={p.postDateTo}       setPostDateTo={p.setPostDateTo}
          setPage={p.setPage}
        />
      )}
    </div>
  );
}