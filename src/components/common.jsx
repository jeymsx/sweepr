import { EXT_COLORS, formatSize, formatDate, getSizeClass, getExtCategory, SORT_OPTIONS } from '../utils';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.avif']);

// ─── SVG Icon primitives ─────────────────────────────────────────────────────

export function Icon({ d, size = 16, className = '', strokeWidth = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {Array.isArray(d)
        ? d.map((p, i) => <path key={i} d={p} />)
        : <path d={d} />}
    </svg>
  );
}

export const ICONS = {
  scanner:   'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  results:   ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2', 'M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'],
  locations: ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
  settings:  ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  about:     'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  folder:    ['M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L11 7h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'],
  trash:     ['M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'],
  list:      ['M4 6h16M4 10h16M4 14h16M4 18h16'],
  grid:      ['M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z'],
  filter:    ['M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'],
  chevronDown: 'M19 9l-7 7-7-7',
  search:    'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  open:      ['M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'],
  scan:      ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
  play:      'M5 3l14 9-14 9V3z',
  refresh:   'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  stop:      'M6 6h12v12H6z',
  dots:      ['M5 12h.01M12 12h.01M19 12h.01'],
  moon:      'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  sun:       'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  plus:      'M12 4v16m8-8H4',
  x:         'M6 18L18 6M6 6l12 12',
  drive:     ['M2 8a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z', 'M6 12h.01M10 12h.01'],
  monitor:   ['M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
  heart:     'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  lock:      ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
};

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 20 }) {
  return (
    <div style={{ width: size, height: size }}
      className="border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
  );
}

// ─── Circular progress (SVG, uses CSS vars for theming) ───────────────────────

export function CircularProgress({ percent }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - Math.min(percent / 100, 0.95) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--track-color)" strokeWidth="8" />
      <circle cx="48" cy="48" r={r} fill="none" stroke="#3b82f6" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      <text x="48" y="54" textAnchor="middle" fill="var(--text-primary)" fontSize="15" fontWeight="700">
        {percent}%
      </text>
    </svg>
  );
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────

export function TypeBadge({ ext }) {
  if (!ext) return null;
  const bg = EXT_COLORS[ext] ?? 'bg-slate-600';
  const label = ext === 'folder' ? 'Folder' : ext;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium text-white ${bg}`}>
      {label}
    </span>
  );
}

// ─── FileIcon ─────────────────────────────────────────────────────────────────

const CAT_ICON = {
  video:   { sym: '▶',  cls: 'bg-purple-900/60 text-purple-400' },
  archive: { sym: '⊞',  cls: 'bg-amber-900/60  text-amber-400'  },
  pdf:     { sym: 'P',  cls: 'bg-red-900/60    text-red-400'    },
  doc:     { sym: 'W',  cls: 'bg-blue-900/60   text-blue-400'   },
  sheet:   { sym: 'X',  cls: 'bg-green-900/60  text-green-400'  },
  image:   { sym: '⬡',  cls: 'bg-emerald-900/60 text-emerald-400'},
  disk:    { sym: '◎',  cls: 'bg-sky-900/60    text-sky-400'    },
  exe:     { sym: '⚙',  cls: 'bg-orange-900/60 text-orange-400' },
  code:    { sym: '{}', cls: 'bg-yellow-900/60 text-yellow-400' },
  audio:   { sym: '♪',  cls: 'bg-pink-900/60   text-pink-400'   },
  folder:  { sym: '▤',  cls: 'bg-yellow-900/60 text-yellow-400' },
  default: { sym: '◻',  cls: 'bg-slate-700/60  text-slate-400'  },
};

export function FileIcon({ ext }) {
  const { sym, cls } = CAT_ICON[getExtCategory(ext)] ?? CAT_ICON.default;
  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 ${cls}`}>
      {sym}
    </div>
  );
}

// ─── SizeInput (number + unit select) ────────────────────────────────────────

export function SizeInput({ value, unit, onValue, onUnit, placeholder }) {
  return (
    <div className="flex h-8 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-shadow bg-transparent hover:border-gray-300 dark:hover:border-slate-600">
      <input
        type="number"
        value={value}
        onChange={(e) => onValue(e.target.value)}
        placeholder={placeholder}
        className="w-16 h-full px-2.5 text-[11px] bg-transparent text-gray-900 dark:text-slate-200 focus:outline-none"
      />
      <div className="w-px bg-gray-200 dark:bg-slate-700" />
      <select
        value={unit}
        onChange={(e) => onUnit(e.target.value)}
        className="h-full px-2 text-[11px] font-medium bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none pr-6 relative"
        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%2364748b" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundPosition: 'right 2px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
      >
        <option value="MB">MB</option>
        <option value="GB">GB</option>
        <option value="TB">TB</option>
      </select>
    </div>
  );
}

export function SortDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 pl-3 pr-7 text-[11px] font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow cursor-pointer appearance-none"
      >
        <option value="size|desc">Size (Largest)</option>
        <option value="size|asc">Size (Smallest)</option>
        <option value="name|asc">Name (A–Z)</option>
        <option value="name|desc">Name (Z–A)</option>
        <option value="modified|desc">Date (Newest)</option>
        <option value="modified|asc">Date (Oldest)</option>
        <option value="extension|asc">Type (A–Z)</option>
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
        <Icon d={ICONS.chevronDown} size={10} />
      </div>
    </div>
  );
}

// ─── DeleteModal ─────────────────────────────────────────────────────────────

export function DeleteModal({ modal, onConfirm, onCancel }) {
  if (!modal) return null;
  const isMultiple = modal.paths.length > 1;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity" onClick={onCancel}>
      <div className="bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-[#2e3449] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
           onClick={e => e.stopPropagation()}>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center shrink-0">
            <Icon d={ICONS.trash} size={16} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-[14px] font-medium text-gray-900 dark:text-white tracking-tight">
              Delete {isMultiple ? `${modal.paths.length} items` : 'File'}?
            </h3>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {isMultiple
                ? 'Are you sure you want to permanently delete the selected items? '
                : <span className="block truncate mb-1">Are you sure you want to delete <strong>"{modal.names[0]}"</strong>? </span>}
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-gray-50 dark:border-slate-800/40">
          <button onClick={onCancel}
            className="px-4 py-2 text-[11px] font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300/50">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 text-[11px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50">
            Delete {isMultiple ? 'All' : ''}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── FileRow (list view row) ──────────────────────────────────────────────────

// ─── File Extension Pill Helper ──────────────────────────────────────────────

function getFilePillStyle(ext) {
  const e = (ext || '').replace(/^\./, '').toLowerCase();
  
  // ─── Images (Emerald) ───
  if (['png','jpg','jpeg','gif','svg','webp','bmp','ico','tiff','tif','raw','heic','heif','cr2','cr3','nef','orf','arw','dng'].includes(e)) 
    return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20';
  
  // ─── Videos (Purple) ───
  if (['mp4','mkv','avi','mov','wmv','flv','webm','m4v','3gp','3g2','ts','mpg','mpeg','rm','rmvb','vob','m2ts','swf'].includes(e)) 
    return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20';
  
  // ─── Documents & E-Books (Blue) ───
  if (['pdf','doc','docx','txt','rtf','xls','xlsx','ppt','pptx','csv','pages','numbers','key','epub','mobi','azw3','djvu','md','markdown','rst','tex','odt','ods','odp'].includes(e)) 
    return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20';
  
  // ─── Archives & Disk Images (Amber) ───
  if (['zip','rar','7z','tar','gz','xz','bz2','iso','tgz','lzma','cab','dmg','pkg','z','vdi','vhd','vmdk'].includes(e)) 
    return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20';
  
  // ─── Executables & Installers (Orange) ───
  if (['exe','msi','apk','app','bat','sh','bin','com','cmd','vbs','ps1','jar','war','deb','rpm','run','out','AppImage'].includes(e)) 
    return 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200/50 dark:border-orange-500/20';
  
  // ─── Audio (Pink) ───
  if (['mp3','wav','ogg','flac','aac','m4a','wma','aiff','alac','mid','midi','mka','opus','amr'].includes(e)) 
    return 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200/50 dark:border-pink-500/20';
  
  // ─── Code & Web Dev (Indigo) ───
  if (['js','jsx','ts','tsx','html','htm','css','scss','sass','less','json','py','java','cpp','c','h','hpp','php','rb','go','rs','swift','kt','kts','scala','cs','fs','vb','lua','pl','bash','zsh','vue','svelte','pug','graphql','gql','dart','m','r'].includes(e))
    return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20';

  // ─── Design, Vector & 3D (Cyan) ───
  if (['psd','ai','indd','xd','sketch','fig','figma','blend','obj','stl','fbx','max','3ds','dwg','dxf','dae','svgz','eps','cdr','prproj','aep'].includes(e))
    return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-500/20';

  // ─── Data, Config & Databases (Teal) ───
  if (['sql','db','sqlite','sqlite3','dbf','mdb','accdb','xml','yaml','yml','toml','ini','env','cfg','conf','plist','csv','tsv'].includes(e))
    return 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200/50 dark:border-teal-500/20';

  // ─── Fonts (Lime) ───
  if (['ttf','otf','woff','woff2','eot'].includes(e))
    return 'bg-lime-50 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400 border-lime-200/50 dark:border-lime-500/20';

  // ─── System, Temp & Logs (Rose) ───
  if (['sys','dll','log','bak','tmp','temp','swp','dump','crash','pid','lock','old'].includes(e))
    return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20';

  // ─── Default (Gray) ───
  return 'bg-gray-100 text-gray-600 dark:bg-slate-800/80 dark:text-slate-400 border-gray-200 dark:border-slate-700/80';
}

// ─── FileRow (List View) ──────────────────────────────────────────────────────

export function FileRow({ file, selected, onToggle, onDelete }) {
  const displayExt = file.extension ? file.extension.replace(/^\./, '') : 'FILE';

  return (
    <tr className={`border-b border-gray-50 dark:border-slate-800/40 group transition-colors ${
      selected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-slate-800/20'
    }`}>
      <td className="px-5 py-2 text-center">
        <input type="checkbox" checked={selected} onChange={onToggle}
          className="cursor-pointer accent-blue-500 rounded-sm" />
      </td>
      <td className="px-3 py-2 text-[11px] font-medium text-gray-800 dark:text-slate-200" style={{ maxWidth: 0, overflow: 'hidden' }} title={file.name}>
        <button onClick={() => window.sweepr.showInFolder(file.fullPath)}
          className="truncate w-full text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
          {file.name}
        </button>
      </td>
      <td className="px-3 py-2 text-[11px] text-gray-500 dark:text-slate-400 tabular-nums">
        {formatSize(file.size)}
      </td>
      <td className="px-3 py-2 text-[11px] text-gray-500 dark:text-slate-400">
        {new Date(file.modified).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>
      <td className="px-3 py-2">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-medium uppercase tracking-wider ${getFilePillStyle(file.extension)}`}>
          {displayExt}
        </span>
      </td>
      <td className="px-3 py-2 text-[10px] text-gray-400 dark:text-slate-500 truncate max-w-[200px] hidden xl:table-cell" title={file.fullPath}>
        {file.fullPath}
      </td>
      <td className="px-5 py-2 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => window.sweepr.openInExplorer(file.fullPath)} title="Open Location"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 shadow-sm transition-all">
            <Icon d={ICONS.folder} size={11} />
          </button>
          <button onClick={onDelete} title="Delete File"
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 shadow-sm transition-all">
            <Icon d={ICONS.trash} size={11} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── FileCard (Grid View) ─────────────────────────────────────────────────────

export function FileCard({ file, selected, onToggle, onDelete }) {
  const displayExt = file.extension ? file.extension.replace(/^\./, '') : 'FILE';

  return (
    <div className={`relative flex flex-col p-3.5 rounded-xl border transition-all duration-200 group ${
      selected 
        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30 shadow-sm' 
        : 'bg-transparent border-gray-100 dark:border-slate-800/60 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/20'
    }`}>
      
      {/* Checkbox Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <input type="checkbox" checked={selected} onChange={onToggle}
          className={`cursor-pointer accent-blue-500 rounded-sm transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      </div>
      
      {/* Hover Actions Overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => window.sweepr.openInExplorer(file.fullPath)} title="Open Location"
          className="p-1.5 rounded-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-500 hover:text-gray-800 dark:hover:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <Icon d={ICONS.folder} size={10} />
        </button>
        <button onClick={onDelete} title="Delete File"
          className="p-1.5 rounded-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <Icon d={ICONS.trash} size={10} />
        </button>
      </div>

      {/* Icon Area */}
      <div className="h-12 flex items-center justify-center mb-3 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
        <Icon d={ICONS.document || 'M4 4v16h16V8l-4-4H4z'} size={26} className="text-gray-400 dark:text-slate-500" />
      </div>
      
      {/* Meta Info */}
      <div className="mt-auto flex flex-col gap-1.5">
        <p className="text-[11px] font-medium text-gray-800 dark:text-slate-200 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 dark:text-slate-400 tabular-nums">{formatSize(file.size)}</span>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-medium uppercase tracking-wider ${getFilePillStyle(file.extension)}`}>
            {displayExt}
          </span>
        </div>
      </div>
    </div>
  );
}