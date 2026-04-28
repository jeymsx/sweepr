import { useState, useEffect } from 'react';
import { Icon, ICONS } from '../components/common';

const FEATURES = [
  { icon: ICONS.scanner,   label: 'Fast & Efficient',      desc: 'Scan millions of files quickly',         bg: 'bg-blue-50 dark:bg-blue-500/10',       fg: 'text-blue-500'    },
  { icon: ICONS.filter,    label: 'Smart Filters',         desc: "Find what's taking up space",            bg: 'bg-violet-50 dark:bg-violet-500/10',   fg: 'text-violet-500'  },
  { icon: ICONS.locations, label: 'Multiple Sources',      desc: 'Scan drives, folders, and more',         bg: 'bg-emerald-50 dark:bg-emerald-500/10', fg: 'text-emerald-500' },
  { icon: ICONS.trash,     label: 'Safe & Secure',         desc: 'Your data stays on your device',         bg: 'bg-amber-50  dark:bg-amber-500/10',    fg: 'text-amber-500'   },
];

const TECH = [
  {
    title: 'React',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
          <ellipse rx="11" ry="4.2" cx="12" cy="12"/>
          <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(60 12 12)"/>
          <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(120 12 12)"/>
        </g>
      </svg>
    )
  },
  {
    title: 'Vite',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M3 3l7 18 7-18-7 4-7-4z" fill="#646CFF"/>
        <path d="M10 21l2-6 2 6-2 1-2-1z" fill="#FFD62E"/>
      </svg>
    )
  },
  {
    title: 'Node.js',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" fill="#3C873A"/>
        <text x="12" y="16" textAnchor="middle" fontSize="6" fill="white" fontFamily="Arial">JS</text>
      </svg>
    )
  },
  {
    title: 'Tailwind',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M4 13c1.5-2 3-3 5-3 2 0 3.5 1 5 3s3 3 5 3c2 0 3.5-1 5-3-1.5 4-4 6-7 6-2 0-3.5-1-5-3s-3-3-5-3c-2 0-3.5 1-5 3 1.5-4 4-6 7-6 2 0 3.5 1 5 3z" fill="#38BDF8"/>
      </svg>
    )
  }
];

export default function AboutPage({ onNavigate }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    window.sweepr.getAppInfo?.().then(setInfo).catch(() => {});
  }, []);

  const platformLabel = info
    ? `${info.platform === 'win32' ? 'Windows' : info.platform === 'darwin' ? 'macOS' : info.platform} (${info.arch})`
    : '—';

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">About Sweepr</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          Learn more about the application and its environment.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">

        {/* ── Top Section (Split View) ── */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-slate-800/60 border-b border-gray-100 dark:border-slate-800/60 min-h-0">
          
          {/* Left: Identity */}
          <div className="flex flex-col justify-between px-6 py-6 bg-white dark:bg-[#161b27]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center
                              text-white font-medium text-2xl shrink-0 shadow-sm select-none">
                S
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">Sweepr</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[12px] font-medium text-gray-500 dark:text-slate-400">Version 1.0.0</span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium
                                   bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stable
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-8">
              <p>Copyright © 2026 Sweepr.</p>
              <p>All rights reserved.</p>
            </div>
          </div>

          {/* Right: Tagline + Features */}
          <div className="flex flex-col justify-center px-6 py-6 bg-gray-50/20 dark:bg-slate-900/10">
            <p className="text-[14px] font-medium text-gray-800 dark:text-slate-200 mb-1.5">
              Free up space. Take back control.
            </p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
              Sweepr is a powerful disk space analyzer and cleanup tool. It helps you find
              large files and unnecessary data so you can keep your storage clean and organized.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {FEATURES.map(f => (
                <div key={f.label} className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${f.bg}`}>
                    <Icon d={f.icon} size={12} className={f.fg} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[11px] font-medium text-gray-800 dark:text-slate-200 leading-tight">{f.label}</p>
                    <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Section (3 Columns) ── */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800/60 min-h-0 bg-white dark:bg-[#161b27]">
          
          {/* System Info */}
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 shrink-0">
              <div className="w-7 h-7 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
                <Icon d={ICONS.monitor} size={12} className="text-gray-500 dark:text-slate-400" />
              </div>
              <h3 className="text-[12px] font-medium text-gray-900 dark:text-white">System Info</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-50 dark:divide-slate-800/40">
              {[
                ['Platform',     platformLabel],
                ['OS Version',   info?.osVersion  ?? '—'],
                ['Architecture', info?.arch        ?? '—'],
                ['Electron',     info ? `v${info.electronVersion}` : '—'],
                ['Node.js',      info ? `v${info.nodeVersion}`     : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                  <span className="text-[11px] text-gray-500 dark:text-slate-500 shrink-0">{k}</span>
                  <span className="text-[11px] font-medium text-gray-800 dark:text-slate-300 text-right truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 shrink-0">
              <div className="w-7 h-7 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
                <Icon d={ICONS.about} size={12} className="text-gray-500 dark:text-slate-400" />
              </div>
              <h3 className="text-[12px] font-medium text-gray-900 dark:text-white">App Info</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-50 dark:divide-slate-800/40">
              {[
                ['App Version',  '1.0.0'],
                ['Build Number', '1000'],
                ['Release Date', 'April 2026'],
                ['UI Framework', 'React + Tailwind CSS'],
                ['Engine',       'Electron'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                  <span className="text-[11px] text-gray-500 dark:text-slate-500 shrink-0">{k}</span>
                  <span className="text-[11px] font-medium text-gray-800 dark:text-slate-300 text-right truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Built With */}
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-3 shrink-0">
              <div className="w-7 h-7 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
                <Icon d={ICONS.heart} size={12} className="text-gray-500 dark:text-slate-400" />
              </div>
              <h3 className="text-[12px] font-medium text-gray-900 dark:text-white">Built With</h3>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
              Sweepr is powered by amazing open-source technologies and libraries.
            </p>
            
            <div className="grid grid-cols-2 gap-2.5 mb-auto">
              {TECH.map(t => (
                <div
                  key={t.title}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-50/80 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/50
                             transition-colors hover:bg-gray-100 dark:hover:bg-slate-800/80"
                >
                  <div className="opacity-80 drop-shadow-sm shrink-0 flex items-center justify-center w-4 h-4">{t.svg}</div>
                  <span className="text-[10px] font-medium text-gray-700 dark:text-slate-300 truncate">{t.title}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-5 pt-3 border-t border-gray-50 dark:border-slate-800/40">
              Special thanks to all contributors and the open-source community.
            </p>
          </div>
        </div>

      </div>

      {/* ── Footer Strip ── */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/30 dark:bg-slate-900/10">
        <p className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-500">
          <Icon d={ICONS.lock} size={10} className="opacity-70" />
          Sweepr does not collect, store, or transmit personal data.
        </p>
        <div className="flex items-center gap-3 text-[10px] text-blue-500 font-medium">
          <button onClick={() => onNavigate?.('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</button>
          <span className="text-gray-200 dark:text-slate-700 font-normal">•</span>
          <button onClick={() => onNavigate?.('terms')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Use</button>
          <span className="text-gray-200 dark:text-slate-700 font-normal">•</span>
          <button onClick={() => onNavigate?.('licenses')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Open Source Licenses</button>
        </div>
      </div>

    </div>
  );
}