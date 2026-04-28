import { useState } from 'react';
import { Icon, ICONS, FileRow, FileCard, SortDropdown, DeleteModal } from '../components/common';
import { formatSize, PAGE_SIZE } from '../utils';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

function SizePicker({ val, onVal, unit, onUnit, placeholder }) {
  return (
    <div className="flex h-7 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500/50 bg-transparent">
      <input type="number" min="0" value={val} onChange={e => onVal(e.target.value)}
        placeholder={placeholder}
        className="w-16 px-2 text-[11px] bg-transparent text-gray-900 dark:text-slate-200 focus:outline-none" />
      <div className="w-px bg-gray-200 dark:bg-slate-700 shrink-0" />
      <select value={unit} onChange={e => onUnit(e.target.value)}
        className="px-1.5 text-[11px] bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 focus:outline-none cursor-pointer border-0 appearance-none pr-4"
        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%2364748b" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundPosition: 'right 1px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px' }}>
        {UNITS.map(u => <option key={u}>{u}</option>)}
      </select>
    </div>
  );
}

export default function ResultsPage(p) {
  const [showFilter, setShowFilter] = useState(false);
  const [extSearch,  setExtSearch]  = useState('');
  const [minVal,  setMinVal]  = useState('');
  const [minUnit, setMinUnit] = useState('MB');
  const [maxVal,  setMaxVal]  = useState('');
  const [maxUnit, setMaxUnit] = useState('GB');

  const [colWidths, setColWidths] = useState({ name: 220, size: 90, modified: 130, type: 76 });

  const startResize = (col, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = colWidths[col];
    const onMove = mv => setColWidths(prev => ({ ...prev, [col]: Math.max(60, startW + mv.clientX - startX) }));
    const onUp   = ()  => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const applyMin = (v, u) => { p.setPostMinSize(v ? `${v}${u}` : ''); p.setPage(0); };
  const applyMax = (v, u) => { p.setPostMaxSize(v ? `${v}${u}` : ''); p.setPage(0); };

  if (!p.scanDone && !p.isScanning) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-transparent gap-5">
        <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center opacity-50">
          <Icon d={ICONS.results} size={24} className="text-gray-400 dark:text-slate-600" />
        </div>
        <p className="text-[13px] font-medium text-gray-500 dark:text-slate-500">No scan results available.</p>
        <button onClick={() => p.onNavigate('scanner')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-medium rounded-lg transition-colors">
          Go to Scanner
        </button>
      </div>
    );
  }

  const resultFiles  = p.isScanning ? p.topFiles : p.pageFiles;
  const filterActive = p.postExtChips.size > 0 || p.includeFolders || p.postMinSize || p.postMaxSize || p.postDateFrom || p.postDateTo;
  const filterCount  = [p.postExtChips.size > 0, p.includeFolders, !!(p.postMinSize || p.postMaxSize), !!(p.postDateFrom || p.postDateTo)].filter(Boolean).length;

  const visibleExts = (p.availableExts || []).filter(ext =>
    !extSearch || ext.toLowerCase().includes(extSearch.toLowerCase())
  );

  const toggleExt = ext => {
    p.setPostExtChips(prev => { const n = new Set(prev); n.has(ext) ? n.delete(ext) : n.add(ext); return n; });
    p.setPage(0);
  };

  const clearFilters = () => {
    p.setPostExtChips(new Set());
    p.setPostMinSize(''); p.setPostMaxSize('');
    p.setPostDateFrom(''); p.setPostDateTo('');
    p.setIncludeFolders(false);
    setMinVal(''); setMaxVal('');
    p.setPage(0);
  };

  const ResizeTh = ({ label, col, className = '' }) => {
    const [sk, sd] = p.sortOption.split('|');
    const active   = sk === col;
    return (
      <th style={{ width: colWidths[col], position: 'relative' }}
        className={`px-3 py-2.5 text-left select-none ${className}`}>
        <button onClick={() => { p.onSortChange(`${col}|${active && sd === 'desc' ? 'asc' : 'desc'}`); p.setPage(0); }}
          className="text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide hover:text-gray-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
          {label}
          {active && <span className="ml-1 text-blue-500">{sd === 'asc' ? '↑' : '↓'}</span>}
        </button>
        <div onMouseDown={e => startResize(col, e)}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400/50 dark:hover:bg-blue-500/40 transition-colors" />
      </th>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Scan Results</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
            {p.filteredCount.toLocaleString()} items matched
            <span className="mx-1.5 opacity-50">•</span>
            {formatSize(p.stats.totalSize)} total
          </p>
          {p.folderPath && (
            <>
              <span className="text-gray-300 dark:text-slate-700 text-[12px]">•</span>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 font-mono truncate max-w-[400px]" title={p.folderPath}>
                Scanned: {p.folderPath}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 px-6 py-2.5 border-b border-gray-50 dark:border-slate-800/40 bg-gray-50/50 dark:bg-slate-900/10 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Icon d={ICONS.search} size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={p.search} onChange={e => { p.setSearch(e.target.value); p.setPage(0); }}
            placeholder="Search files..."
            className="pl-7 pr-2.5 py-1.5 text-[11px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                       text-gray-900 dark:text-slate-200 rounded-md w-52 focus:outline-none focus:ring-1 focus:ring-blue-500/50
                       hover:border-gray-300 dark:hover:border-slate-600 transition-shadow" />
        </div>

        <button onClick={() => setShowFilter(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md border transition-colors ${
            filterActive || showFilter
              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
          }`}>
          <Icon d={ICONS.filter} size={11} />
          Filters
          {filterCount > 0 && (
            <span className="ml-0.5 min-w-[16px] h-4 px-1 bg-blue-500 text-white text-[9px] font-medium rounded-full flex items-center justify-center leading-none">
              {filterCount}
            </span>
          )}
        </button>

        <div className="flex-1" />
        <SortDropdown value={p.sortOption} onChange={v => { p.onSortChange(v); p.setPage(0); }} />
        <div className="flex h-8 p-0.5 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
          {[['list', ICONS.list], ['card', ICONS.grid]].map(([mode, iconD]) => {
            const isActive = p.viewMode === mode;
            return (
              <button key={mode} onClick={() => p.setViewMode(mode)}
                className={`px-2.5 flex items-center transition-all rounded ${isActive ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}>
                <Icon d={iconD} size={11} className={isActive ? 'opacity-100' : 'opacity-70'} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {p.error && (
        <div className="shrink-0 mx-6 mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-[12px] font-medium text-red-600 dark:text-red-400">
          <span className="flex-1">{p.error}</span>
          <button onClick={() => p.setError('')} className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors">
            <Icon d={ICONS.x} size={11} />
          </button>
        </div>
      )}

      {/* Body: table + filter sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Main Content */}
        <div className="flex-1 overflow-auto min-w-0">
          {p.viewMode === 'list' ? (
            <table className="w-full text-[12px] border-collapse table-fixed">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: colWidths.name }} />
                <col style={{ width: colWidths.size }} />
                <col style={{ width: colWidths.modified }} />
                <col style={{ width: colWidths.type }} />
                <col />
                <col style={{ width: 80 }} />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-white/95 dark:bg-[#161b27]/95 backdrop-blur-sm shadow-sm">
                <tr className="border-b border-gray-100 dark:border-slate-800/60">
                  <th className="px-5 py-2.5 w-12 text-center">
                    <input type="checkbox" checked={p.allPageSelected} onChange={p.onToggleSelectAll}
                      disabled={resultFiles.length === 0} className="cursor-pointer accent-blue-500 rounded-sm" />
                  </th>
                  <ResizeTh label="Name"     col="name" />
                  <ResizeTh label="Size"     col="size" />
                  <ResizeTh label="Modified" col="modified" />
                  <ResizeTh label="Type"     col="type" />
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide hidden xl:table-cell">Path</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {resultFiles.map(file => (
                  <FileRow key={file.id} file={file}
                    selected={p.selected.has(file.fullPath)}
                    onToggle={() => p.onToggleSelect(file.fullPath)}
                    onDelete={() => p.onDeleteFile([file.fullPath])} />
                ))}
                {resultFiles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center text-[12px] font-medium text-gray-400 dark:text-slate-500">
                      No files match the current filters.
                    </td>
                  </tr>
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

        {/* Filter Sidebar */}
        {showFilter && (
          <div className="w-56 shrink-0 border-l border-gray-100 dark:border-slate-800/60 flex flex-col overflow-hidden bg-gray-50/30 dark:bg-slate-900/10">

            {/* Sidebar header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800/60">
              <span className="text-[11px] font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Filters</span>
              <div className="flex items-center gap-2">
                {filterActive && (
                  <button onClick={clearFilters}
                    className="text-[10px] font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors">
                    Clear
                  </button>
                )}
                <button onClick={() => setShowFilter(false)}
                  className="p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <Icon d={ICONS.x} size={12} />
                </button>
              </div>
            </div>

            {/* Scrollable filter sections */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-5">

              {/* File Type */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">File Type</label>
                  {p.postExtChips.size > 0 && (
                    <span className="text-[9px] font-medium text-blue-500">{p.postExtChips.size} selected</span>
                  )}
                </div>
                <div className="relative">
                  <Icon d={ICONS.search} size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input value={extSearch} onChange={e => setExtSearch(e.target.value)}
                    placeholder="Search types..."
                    className="w-full pl-6 pr-2 py-1.5 text-[10px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                               rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50
                               text-gray-900 dark:text-slate-200 placeholder-gray-400" />
                </div>
                <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto">
                  {visibleExts.length === 0 && (
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 py-1">No types found</span>
                  )}
                  {visibleExts.map(ext => {
                    const label  = ext.length > 10 ? ext.slice(0, 10) + '…' : ext;
                    const active = p.postExtChips.has(ext);
                    return (
                      <button key={ext} onClick={() => toggleExt(ext)} title={ext}
                        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left text-[11px] font-medium transition-colors ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${active ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Range */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Size Range</label>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 w-6 shrink-0">Min</span>
                    <SizePicker val={minVal} onVal={v => { setMinVal(v); applyMin(v, minUnit); }} unit={minUnit} onUnit={u => { setMinUnit(u); applyMin(minVal, u); }} placeholder="0" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 w-6 shrink-0">Max</span>
                    <SizePicker val={maxVal} onVal={v => { setMaxVal(v); applyMax(v, maxUnit); }} unit={maxUnit} onUnit={u => { setMaxUnit(u); applyMax(maxVal, u); }} placeholder="∞" />
                  </div>
                </div>
              </div>

              {/* Modified Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Modified Date</label>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">From</span>
                    <input type="date" value={p.postDateFrom} onChange={e => { p.setPostDateFrom(e.target.value); p.setPage(0); }}
                      className="w-full h-7 px-2 text-[10px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                                 text-gray-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">To</span>
                    <input type="date" value={p.postDateTo} onChange={e => { p.setPostDateTo(e.target.value); p.setPage(0); }}
                      className="w-full h-7 px-2 text-[10px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                                 text-gray-900 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Options</label>
                <label className="flex items-center gap-2 cursor-pointer px-1">
                  <input type="checkbox" checked={p.includeFolders} onChange={e => { p.setIncludeFolders(e.target.checked); p.setPage(0); }}
                    className="cursor-pointer accent-blue-500 rounded-sm" />
                  <span className="text-[11px] text-gray-700 dark:text-slate-300">Include Folders</span>
                </label>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27]">
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
        {p.scanDone && p.totalPages > 1 && (
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 hidden sm:inline-block">
              {p.page * PAGE_SIZE + 1}–{Math.min((p.page + 1) * PAGE_SIZE, p.filteredCount)} of {p.filteredCount.toLocaleString()}
            </span>
            <div className="flex gap-1.5">
              {[['«', () => p.setPage(0)], ['‹', () => p.setPage(p.page - 1)], ['›', () => p.setPage(p.page + 1)], ['»', () => p.setPage(p.totalPages - 1)]].map(([sym, fn], i) => (
                <button key={sym} onClick={fn} disabled={i < 2 ? p.page === 0 : p.page >= p.totalPages - 1}
                  className="px-2.5 py-1 text-[11px] rounded bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-200 dark:border-slate-700">
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <DeleteModal modal={p.deleteModal} onConfirm={p.onConfirmDelete} onCancel={p.onCancelDelete} />
    </div>
  );
}
