import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Icon, ICONS } from './components/common';
import ScannerPage  from './pages/Scanner';
import ResultsPage  from './pages/Results';
import LocationsPage from './pages/Locations';
import SettingsPage from './pages/Settings';
import AboutPage    from './pages/About';
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsOfUsePage    from './pages/TermsOfUse';
import LicensesPage      from './pages/Licenses';
import {
  PAGE_SIZE, TOP_N, SORT_OPTIONS,
  toBytes, normalizeExts,
  useDebounce, useLocalStorage,
  getExtCategory,
} from './utils';

// ─── parseSize (plain string like "100MB") ────────────────────────────────────
function parseSize(str) {
  if (!str) return 0;
  const m = str.trim().match(/^([\d.]+)\s*(b|kb|mb|gb|tb)?$/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const u = (m[2] || 'b').toLowerCase();
  return n * ({ b: 1, kb: 1024, mb: 1024**2, gb: 1024**3, tb: 1024**4 }[u] ?? 1);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'scanner',   label: 'Scanner',   icon: ICONS.scanner  },
  { id: 'results',   label: 'Results',   icon: ICONS.results  },
  { id: 'locations', label: 'Locations', icon: ICONS.locations  },
  { id: 'settings',  label: 'Settings',  icon: ICONS.settings  },
];

const ABOUT_PAGES = [
  { id: 'privacy',  label: 'Privacy Policy',       icon: ICONS.lock    },
  { id: 'terms',    label: 'Terms of Use',          icon: ICONS.results },
  { id: 'licenses', label: 'Open Source Licenses',  icon: ICONS.heart   },
];

function Sidebar({ active, onNavigate, darkMode, onToggleDark, collapsed, onToggleCollapse }) {
  const [aboutOpen, setAboutOpen] = useState(
    ABOUT_PAGES.some(p => p.id === active)
  );

  const item = (id, label, iconD) => {
    const isActive = active === id;
    return (
      <button key={id} onClick={() => onNavigate(id)} title={collapsed ? label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
        } ${collapsed ? 'justify-center px-2' : ''}`}>
        <Icon d={iconD} size={16} className="shrink-0" />
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} shrink-0 flex flex-col bg-white dark:bg-[#161b27] rounded-2xl shadow-lg border border-gray-200 dark:border-[#2e3449] transition-[width] duration-300 overflow-hidden z-10`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 pt-6 pb-4 ${collapsed ? 'justify-center px-2' : 'px-6'}`}>
        <div className="w-8 h-8 bg-blue-500 rounded-[10px] flex items-center justify-center text-white font-medium text-base shrink-0 shadow-sm">
          S
        </div>
        {!collapsed && <span className="font-medium text-gray-900 dark:text-white tracking-tight text-[17px]">Sweepr</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV.map(n => item(n.id, n.label, n.icon))}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1 mt-auto border-t border-gray-50 dark:border-slate-800/60 bg-gray-50/30 dark:bg-slate-900/10">
        <button onClick={onToggleDark} title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-slate-400
                      hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200 transition-colors
                      ${collapsed ? 'justify-center px-2' : ''}`}>
          <Icon d={darkMode ? ICONS.sun : ICONS.moon} size={16} className="shrink-0" />
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        {/* About + dropdown */}
        <div>
          <div className={`flex items-center rounded-lg transition-colors ${
            active === 'about' || ABOUT_PAGES.some(p => p.id === active)
              ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
          } ${collapsed ? 'justify-center' : ''}`}>
            <button
              onClick={() => onNavigate('about')}
              title={collapsed ? 'About Sweepr' : undefined}
              className={`flex items-center gap-3 py-2 text-[13px] font-medium flex-1 min-w-0 ${collapsed ? 'justify-center px-2' : 'px-3'}`}>
              <Icon d={ICONS.about} size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">About Sweepr</span>}
            </button>
            {!collapsed && (
              <button
                onClick={() => setAboutOpen(o => !o)}
                className="px-2 py-2 shrink-0"
                title={aboutOpen ? 'Collapse' : 'Expand'}>
                <Icon
                  d={ICONS.chevronDown}
                  size={12}
                  className={`transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
          {!collapsed && aboutOpen && (
            <div className="mt-0.5 ml-3 pl-3 border-l border-gray-100 dark:border-slate-800/60 space-y-0.5">
              {ABOUT_PAGES.map(p => {
                const isActive = active === p.id;
                return (
                  <button key={p.id} onClick={() => onNavigate(p.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-800 dark:hover:text-slate-300'
                    }`}>
                    <Icon d={p.icon} size={13} className="shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-slate-400
                      hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200 transition-colors
                      ${collapsed ? 'justify-center px-2' : ''}`}>
          <Icon d={collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'} size={16} className="shrink-0" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Theme & Nav ──
  const [darkMode, setDarkMode] = useLocalStorage('sweepr-dark', true);
  const [activePage, setActivePage] = useState('scanner');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sweepr-sidebar-collapsed', false);

  // ── Settings (persisted) ──
  const [settings, setSettings] = useLocalStorage('sweepr-settings', {
    concurrency: 16, batchSize: 100,
    includeHidden: false, skipSystem: false,
    defaultSort: 'size|desc', defaultView: 'list',
    includeFolders: false,
  });
  const setSetting = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  // ── Folder ──
  const [folderPath, setFolderPath] = useState('');

  // ── Pre-scan filters ──
  const [preExt,      setPreExt]      = useState('');
  const [preMinVal,   setPreMinVal]   = useState('');
  const [preMinUnit,  setPreMinUnit]  = useState('MB');
  const [preMaxVal,   setPreMaxVal]   = useState('');
  const [preMaxUnit,  setPreMaxUnit]  = useState('GB');
  const [preDateFrom, setPreDateFrom] = useState('');
  const [preDateTo,   setPreDateTo]   = useState('');

  // ── Scan state ──
  const [isScanning,   setIsScanning]   = useState(false);
  const [scanDone,     setScanDone]     = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [stats,        setStats]        = useState({ totalFiles: 0, totalSize: 0 });
  const [lastScanTime, setLastScanTime] = useState(null);
  const [error,        setError]        = useState('');
  const allFilesRef = useRef([]);
  const [topFiles,  setTopFiles]  = useState([]);
  const [files,     setFiles]     = useState([]);

  // ── Post-scan controls ──
  const [search,        setSearch]        = useState('');
  const [postExtChips,  setPostExtChips]  = useState(new Set());
  const [postMinSize,   setPostMinSize]   = useState('');
  const [postMaxSize,   setPostMaxSize]   = useState('');
  const [postDateFrom,  setPostDateFrom]  = useState('');
  const [postDateTo,    setPostDateTo]    = useState('');
  const [includeFolders, setIncludeFolders] = useState(!!settings.includeFolders);
  const [sortOption,   setSortOption]   = useState(settings.defaultSort);
  const [viewMode,     setViewMode]     = useState(settings.defaultView);
  const [page,         setPage]         = useState(0);

  // ── Selection & deletion ──
  const [selected,     setSelected]    = useState(new Set());
  const [deleteModal, setDeleteModal] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  // ── IPC listeners ──────────────────────────────────────────────────────────
  useEffect(() => {
    const removeBatch = window.sweepr.onScanBatch(({ files: newFiles }) => {
      for (const f of newFiles) allFilesRef.current.push(f);
      setTopFiles(prev => {
        const threshold = prev.length >= TOP_N ? prev[prev.length - 1].size : -1;
        const candidates = newFiles.filter(f => f.size > threshold || prev.length < TOP_N);
        if (candidates.length === 0) return prev;
        const merged = [...prev, ...candidates];
        merged.sort((a, b) => b.size - a.size);
        return merged.slice(0, TOP_N);
      });
    });

    const removeProgress = window.sweepr.onScanProgress(data => {
      setScanProgress(data);
    });

    const removeComplete = window.sweepr.onScanComplete(({ totalFiles, totalSize }) => {
      setStats({ totalFiles, totalSize });
      setLastScanTime(new Date().toISOString());
      setFiles(allFilesRef.current);
      allFilesRef.current = [];
      setTopFiles([]);
      setScanProgress(null);
      setIsScanning(false);
      setScanDone(true);
      setPage(0);
      try {
        const key = 'sweepr-scan-history';
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        const entry = { path: folderPath, totalFiles, totalSize, scannedAt: new Date().toISOString() };
        const next = [entry, ...prev.filter(h => h.path !== folderPath)].slice(0, 20);
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
    });

    const removeError = window.sweepr.onScanError(msg => {
      setError(msg);
      setFiles(allFilesRef.current);
      allFilesRef.current = [];
      setTopFiles([]);
      setScanProgress(null);
      setIsScanning(false);
      if (allFilesRef.current.length > 0) setScanDone(true);
    });

    return () => { removeBatch(); removeProgress(); removeComplete(); removeError(); };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectFolder = useCallback(async () => {
    const p = await window.sweepr.selectFolder();
    if (!p) return;
    setFolderPath(p);
    setScanDone(false);
    setFiles([]);
    setStats({ totalFiles: 0, totalSize: 0 });
    setSelected(new Set());
    setError('');
  }, []);

  const handleScan = useCallback(async (overridePath) => {
    const target = overridePath || folderPath;
    if (!target) return;

    allFilesRef.current = [];
    setFiles([]);
    setTopFiles([]);
    setStats({ totalFiles: 0, totalSize: 0 });
    setScanProgress(null);
    setError('');
    setIsScanning(true);
    setScanDone(false);
    setSelected(new Set());
    setPage(0);

    const extensions = normalizeExts(preExt);

    await window.sweepr.startScan({
      folderPath: target,
      filters: {
        extensions: extensions.length > 0 ? extensions : null,
        minSize:    toBytes(preMinVal, preMinUnit),
        maxSize:    toBytes(preMaxVal, preMaxUnit),
        dateFrom:   preDateFrom || null,
        dateTo:     preDateTo   || null,
      },
    });
  }, [folderPath, preExt, preMinVal, preMinUnit, preMaxVal, preMaxUnit, preDateFrom, preDateTo]);

  const handleCancelScan = useCallback(async () => {
    await window.sweepr.cancelScan();
    setFiles(allFilesRef.current);
    allFilesRef.current = [];
    setTopFiles([]);
    setScanProgress(null);
    setIsScanning(false);
    setScanDone(true);
    setPage(0);
  }, []);

  // Quick-scan from Locations page
  const handleQuickScan = useCallback((path) => {
    setFolderPath(path);
    setActivePage('scanner');
    // Small delay so scanner page mounts before scan starts
    setTimeout(() => handleScan(path), 50);
  }, [handleScan]);

  const handleSortChange = useCallback((val) => {
    setSortOption(val);
    setPage(0);
  }, []);

  const toggleSelect = useCallback((fp) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(fp) ? next.delete(fp) : next.add(fp);
      return next;
    });
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const availableExts = useMemo(() => {
    const counts = new Map();
    for (const f of files) counts.set(f.extension, (counts.get(f.extension) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([ext]) => ext);
  }, [files]);

  const largestFile = useMemo(() =>
    files.length > 0 ? files.reduce((max, f) => f.size > max.size ? f : max) : null,
  [files]);

  const fileCategoryStats = useMemo(() => {
    const groups = {
      Images:      { label: 'Images',      count: 0, size: 0 },
      Videos:      { label: 'Videos',      count: 0, size: 0 },
      Documents:   { label: 'Documents',   count: 0, size: 0 },
      Archives:    { label: 'Archives',    count: 0, size: 0 },
      Executables: { label: 'Executables', count: 0, size: 0 },
      Audio:       { label: 'Audio',       count: 0, size: 0 },
      Others:      { label: 'Others',      count: 0, size: 0 },
    };
    for (const f of files) {
      const cat = getExtCategory(f.extension);
      const key = cat === 'image' ? 'Images' : cat === 'video' ? 'Videos'
        : ['pdf','doc','sheet'].includes(cat) ? 'Documents' : cat === 'archive' ? 'Archives'
        : cat === 'exe' ? 'Executables' : cat === 'audio' ? 'Audio' : 'Others';
      groups[key].count++;
      groups[key].size += f.size;
    }
    return Object.values(groups).filter(g => g.count > 0).sort((a, b) => b.size - a.size);
  }, [files]);

  const folderRows = useMemo(() => {
    if (!includeFolders || files.length === 0) return [];
    const map = new Map();
    for (const f of files) {
      const dir = f.fullPath.slice(0, f.fullPath.length - f.name.length - 1);
      if (!map.has(dir)) {
        const name = dir.split(/[/\\]/).pop() || dir;
        map.set(dir, { id: `folder:${dir}`, name, fullPath: dir, size: 0, modified: f.modified, extension: 'folder', isFolder: true });
      }
      const entry = map.get(dir);
      entry.size += f.size;
      if (f.modified > entry.modified) entry.modified = f.modified;
    }
    return [...map.values()];
  }, [files, includeFolders]);

  const filteredFiles = useMemo(() => {
    const q = debouncedSearch?.toLowerCase();
    const minSz = parseSize(postMinSize);
    const maxSz = parseSize(postMaxSize);

    let r = files;
    if (q)               r = r.filter(f => f.name.toLowerCase().includes(q) || f.fullPath.toLowerCase().includes(q));
    if (postExtChips.size > 0) r = r.filter(f => postExtChips.has(f.extension));
    if (minSz > 0)       r = r.filter(f => f.size >= minSz);
    if (maxSz > 0)       r = r.filter(f => f.size <= maxSz);
    if (postDateFrom)    { const d = new Date(postDateFrom); r = r.filter(f => new Date(f.modified) >= d); }
    if (postDateTo)      { const d = new Date(postDateTo); d.setHours(23,59,59,999); r = r.filter(f => new Date(f.modified) <= d); }

    if (includeFolders && folderRows.length > 0) {
      let fr = folderRows;
      if (q)        fr = fr.filter(f => f.name.toLowerCase().includes(q) || f.fullPath.toLowerCase().includes(q));
      if (minSz > 0) fr = fr.filter(f => f.size >= minSz);
      if (maxSz > 0) fr = fr.filter(f => f.size <= maxSz);
      r = [...r, ...fr];
    }

    return r;
  }, [files, debouncedSearch, postExtChips, postMinSize, postMaxSize, postDateFrom, postDateTo, includeFolders, folderRows]);

  const sortedFiles = useMemo(() => {
    const [sk, sd] = sortOption.split('|');
    return [...filteredFiles].sort((a, b) => {
      let va, vb;
      switch (sk) {
        case 'name':      va = a.name.toLowerCase(); vb = b.name.toLowerCase(); break;
        case 'modified':  va = a.modified;            vb = b.modified;           break;
        case 'extension': va = a.extension;           vb = b.extension;          break;
        default:          va = a.size;                vb = b.size;
      }
      if (va < vb) return sd === 'asc' ? -1 : 1;
      if (va > vb) return sd === 'asc' ?  1 : -1;
      return 0;
    });
  }, [filteredFiles, sortOption]);

  const totalPages     = Math.max(1, Math.ceil(sortedFiles.length / PAGE_SIZE));
  const currentPage    = Math.min(page, totalPages - 1);
  const pageFiles      = sortedFiles.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const filteredCount  = sortedFiles.length;
  const allPageSelected = pageFiles.length > 0 && pageFiles.every(f => selected.has(f.fullPath));

  const toggleSelectAll = useCallback(() => {
    setSelected(prev => {
      const next = new Set(prev);
      if (pageFiles.every(f => next.has(f.fullPath))) pageFiles.forEach(f => next.delete(f.fullPath));
      else pageFiles.forEach(f => next.add(f.fullPath));
      return next;
    });
  }, [pageFiles]);

  const openDeleteModal = useCallback((paths) => {
    const nameMap = new Map(files.map(f => [f.fullPath, f.name]));
    setDeleteModal({ paths, names: paths.map(p => nameMap.get(p) || p) });
  }, [files]);

  const executeDelete = useCallback(async () => {
    if (!deleteModal) return;
    const results = await window.sweepr.deleteFiles(deleteModal.paths);
    const deleted  = new Set(results.filter(r => r.success).map(r => r.path));
    const failed   = results.filter(r => !r.success);

    setFiles(prev => prev.filter(f => !deleted.has(f.fullPath)));
    setSelected(prev => { const n = new Set(prev); deleted.forEach(p => n.delete(p)); return n; });
    setStats(prev => {
      const removedSize = [...deleted].reduce((acc, p) => acc + (files.find(x => x.fullPath === p)?.size ?? 0), 0);
      return { totalFiles: prev.totalFiles - deleted.size, totalSize: prev.totalSize - removedSize };
    });
    setDeleteModal(null);
    if (failed.length > 0) setError(`Failed to trash ${failed.length} file(s): ${failed.map(r => r.error).join('; ')}`);
  }, [deleteModal, files]);

  // ── Shared props bundle ───────────────────────────────────────────────────
  const sharedProps = {
    // scan state
    isScanning, scanDone, scanProgress, topFiles, stats, lastScanTime, largestFile, fileCategoryStats,
    // results data
    pageFiles, filteredCount, totalPages, page, setPage: (p) => setPage(Math.max(0, p)),
    // post-scan controls
    search, setSearch,
    postExtChips, setPostExtChips, availableExts,
    includeFolders, setIncludeFolders,
    postMinSize, setPostMinSize, postMaxSize, setPostMaxSize,
    postDateFrom, setPostDateFrom, postDateTo, setPostDateTo,
    sortOption, onSortChange: handleSortChange,
    viewMode, setViewMode,
    // selection
    selected, allPageSelected,
    onToggleSelect: toggleSelect, onToggleSelectAll: toggleSelectAll,
    // delete
    onDeleteFile: openDeleteModal,
    deleteModal, onConfirmDelete: executeDelete, onCancelDelete: () => setDeleteModal(null),
    // error
    error, setError,
    // navigation
    onNavigate: setActivePage,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={darkMode ? 'dark' : ''} style={{ height: '100vh', width: '100vw' }}>
      {/* ── App Shell Container (added padding and gap for the floating layout) ── */}
      <div className="h-full flex p-4 gap-4 bg-gray-100 dark:bg-[#0a0d14] text-gray-900 dark:text-white overflow-hidden"
           style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        <Sidebar
          active={activePage}
          onNavigate={setActivePage}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* ── Main Content Area (also made into a floating rounded rectangle to match) ── */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#161b27] rounded-2xl shadow-lg border border-gray-200 dark:border-[#2e3449]">
          {activePage === 'scanner' && (
            <ScannerPage
              {...sharedProps}
              folderPath={folderPath}
              onSelectFolder={handleSelectFolder}
              onScan={handleScan}
              onCancelScan={handleCancelScan}
              preExt={preExt}           setPreExt={setPreExt}
              preMinVal={preMinVal}     setPreMinVal={setPreMinVal}
              preMinUnit={preMinUnit}   setPreMinUnit={setPreMinUnit}
              preMaxVal={preMaxVal}     setPreMaxVal={setPreMaxVal}
              preMaxUnit={preMaxUnit}   setPreMaxUnit={setPreMaxUnit}
              preDateFrom={preDateFrom} setPreDateFrom={setPreDateFrom}
              preDateTo={preDateTo}     setPreDateTo={setPreDateTo}
            />
          )}
          {activePage === 'results' && (
            <ResultsPage {...sharedProps} folderPath={folderPath} />
          )}
          {activePage === 'locations' && (
            <LocationsPage onQuickScan={handleQuickScan} />
          )}
          {activePage === 'settings' && (
            <SettingsPage
              darkMode={darkMode}
              onToggleDark={() => setDarkMode(!darkMode)}
              settings={settings}
              onSaveSettings={newSettings => {
                setSettings(newSettings);
                setViewMode(newSettings.defaultView);
                setSortOption(newSettings.defaultSort);
                setIncludeFolders(!!newSettings.includeFolders);
              }}
              onReset={() => {
                const defaults = { concurrency: 16, batchSize: 100, includeHidden: false, skipSystem: false, defaultSort: 'size|desc', defaultView: 'list', includeFolders: false };
                setSettings(defaults);
                setViewMode(defaults.defaultView);
                setSortOption(defaults.defaultSort);
                setIncludeFolders(false);
              }}
            />
          )}
          {activePage === 'about'     && <AboutPage onNavigate={setActivePage} />}
          {activePage === 'privacy'   && <PrivacyPolicyPage />}
          {activePage === 'terms'     && <TermsOfUsePage />}
          {activePage === 'licenses'  && <LicensesPage />}
        </div>
      </div>
    </div>
  );
}