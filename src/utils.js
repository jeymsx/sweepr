import { useState, useEffect, useCallback } from 'react';

export const PAGE_SIZE = 100;
export const TOP_N     = 100;

export const SORT_OPTIONS = [
  { label: 'Size (Largest)',  key: 'size',      dir: 'desc' },
  { label: 'Size (Smallest)', key: 'size',      dir: 'asc'  },
  { label: 'Name (A–Z)',      key: 'name',      dir: 'asc'  },
  { label: 'Name (Z–A)',      key: 'name',      dir: 'desc' },
  { label: 'Date (Newest)',   key: 'modified',  dir: 'desc' },
  { label: 'Date (Oldest)',   key: 'modified',  dir: 'asc'  },
  { label: 'Type (A–Z)',      key: 'extension', dir: 'asc'  },
];

export const SIZE_UNITS  = ['B', 'KB', 'MB', 'GB', 'TB'];
export const UNIT_BYTES  = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 };

// Extension → badge color classes
export const EXT_COLORS = {
  '.mp4': 'bg-purple-600', '.mkv': 'bg-purple-600', '.avi': 'bg-purple-600',
  '.mov': 'bg-purple-600', '.wmv': 'bg-purple-600', '.webm': 'bg-purple-600',
  '.zip': 'bg-amber-600',  '.rar': 'bg-amber-600',  '.7z': 'bg-amber-600',
  '.tar': 'bg-amber-600',  '.gz':  'bg-amber-600',
  '.pdf': 'bg-red-600',
  '.doc': 'bg-blue-600',   '.docx': 'bg-blue-600',
  '.xls': 'bg-green-700',  '.xlsx': 'bg-green-700',
  '.ppt': 'bg-orange-600', '.pptx': 'bg-orange-600',
  '.iso': 'bg-sky-600',    '.dmg': 'bg-sky-600',    '.img': 'bg-sky-600',
  '.png': 'bg-emerald-600','.jpg': 'bg-emerald-600','.jpeg': 'bg-emerald-600',
  '.gif': 'bg-emerald-600','.webp': 'bg-emerald-600','.svg': 'bg-teal-600',
  '.exe': 'bg-orange-700', '.msi': 'bg-orange-700', '.app': 'bg-orange-700',
  '.js':  'bg-yellow-500', '.ts':  'bg-blue-500',   '.py': 'bg-blue-400',
  '.psd': 'bg-indigo-600', '.ai':  'bg-orange-500',
  'folder': 'bg-yellow-600',
};

export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function getSizeClass(bytes) {
  if (bytes >= 5 * 1024 ** 3) return 'text-red-500';
  if (bytes >= 1024 ** 3)     return 'text-yellow-400';
  return 'text-emerald-500';
}

export function formatClock(seconds) {
  if (seconds == null || seconds < 0) return '—';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (Math.floor(seconds) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDuration(seconds) {
  if (seconds == null || seconds < 0) return '—';
  seconds = Math.round(seconds);
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, '0');
  if (m < 60) return `${m}m ${s}s`;
  return `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`;
}

export function toBytes(val, unit) {
  return (parseFloat(val) || 0) * (UNIT_BYTES[unit] ?? 1);
}

export function normalizeExts(str) {
  return str.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    .map(e => e.startsWith('.') ? e : `.${e}`);
}

export function getExtCategory(ext) {
  if (['.mp4','.mkv','.avi','.mov','.wmv','.webm','.flv','.m4v'].includes(ext)) return 'video';
  if (['.zip','.rar','.7z','.tar','.gz','.bz2'].includes(ext)) return 'archive';
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.doc','.docx','.txt','.rtf','.odt','.pages'].includes(ext)) return 'doc';
  if (['.xls','.xlsx','.csv','.numbers'].includes(ext)) return 'sheet';
  if (['.png','.jpg','.jpeg','.gif','.webp','.svg','.bmp','.tiff'].includes(ext)) return 'image';
  if (['.iso','.dmg','.img'].includes(ext)) return 'disk';
  if (['.exe','.msi','.app','.deb','.rpm'].includes(ext)) return 'exe';
  if (['.js','.ts','.py','.rb','.go','.java','.cs','.cpp','.c','.html','.css','.json'].includes(ext)) return 'code';
  if (['.mp3','.flac','.wav','.aac','.ogg'].includes(ext)) return 'audio';
  if (ext === 'folder') return 'folder';
  return 'default';
}

export function useDebounce(value, ms) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return deb;
}

export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s !== null ? JSON.parse(s) : initial;
    } catch { return initial; }
  });

  const store = useCallback((v) => {
    const next = typeof v === 'function' ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key, val]);

  return [val, store];
}
