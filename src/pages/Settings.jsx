import { useState } from 'react';
import { Icon, ICONS } from '../components/common';

const DEFAULT_SETTINGS = {
  concurrency: 16, batchSize: 100,
  includeHidden: false, skipSystem: false,
  defaultSort: 'size|desc', defaultView: 'list',
  includeFolders: false,
};

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 shrink-0 focus:outline-none ${
        checked ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'
      }`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
        checked ? 'translate-x-[18px]' : 'translate-x-1'
      }`} />
    </button>
  );
}

function StyledSelect({ value, onChange, children }) {
  return (
    <div className="relative group">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-1.5 text-[11px] font-medium text-gray-700 dark:text-slate-300
                   bg-transparent ring-1 ring-gray-200 dark:ring-slate-700
                   hover:ring-gray-300 dark:hover:ring-slate-600 rounded-md focus:outline-none
                   focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-shadow">
        {children}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
        <Icon d={ICONS.chevronDown} size={10} />
      </div>
    </div>
  );
}

function Slider({ min, max, step, value, onChange, unit = '' }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-28 h-1 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none" />
      <span className="text-[11px] text-gray-500 dark:text-slate-400 w-8 text-right tabular-nums tracking-tight">
        {value}{unit}
      </span>
    </div>
  );
}

function Row({ label, description, children, last }) {
  return (
    <div className={`flex items-center justify-between gap-6 py-4 ${
      !last ? 'border-b border-gray-50 dark:border-slate-800/40' : ''
    }`}>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-gray-800 dark:text-slate-200">{label}</p>
        {description && <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const SECTION_META = {
  general:     { icon: ICONS.settings },
  scanning:    { icon: ICONS.scanner  },
  results:     { icon: ICONS.grid     },
  performance: { icon: ICONS.refresh  },
};

function SectionGroup({ id, title, description, children, className = '' }) {
  const m = SECTION_META[id];
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-center shrink-0">
          <Icon d={m.icon} size={14} className="text-gray-500 dark:text-slate-400" />
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-gray-900 dark:text-white tracking-tight">{title}</h2>
          {description && <p className="text-[11px] text-gray-400 dark:text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col mt-2">{children}</div>
    </div>
  );
}

function ViewToggle({ value, onChange }) {
  return (
    <div className="flex p-0.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-md border border-gray-200/50 dark:border-slate-700/50">
      {[['list', ICONS.list, 'List'], ['card', ICONS.grid, 'Card']].map(([mode, iconD, label]) => {
        const isActive = value === mode;
        return (
          <button key={mode} onClick={() => onChange(mode)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium transition-all duration-200 rounded ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}>
            <Icon d={iconD} size={11} className={isActive ? 'text-blue-500 dark:text-blue-400' : 'opacity-70'} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage({ darkMode, onToggleDark, settings, onSaveSettings, onReset }) {
  const [draft, setDraft] = useState({ ...settings });
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const set = (key, val) => {
    setDraft(p => ({ ...p, [key]: val }));
    setDirty(true);
  };

  const handleSave = () => {
    onSaveSettings(draft);
    setDirty(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_SETTINGS });
    setDirty(true);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          Preferences and application behavior.
        </p>
      </div>

      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800/60 min-h-0">

          <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800/60">
            <SectionGroup id="general" title="General" description="Appearance and system integration." className="px-6 py-6">
              <Row label="Dark Mode" description="Use the dark theme across the entire application." last>
                <Toggle checked={darkMode} onChange={onToggleDark} />
              </Row>
            </SectionGroup>

            <SectionGroup id="results" title="Results" description="Presentation defaults." className="px-6 py-6">
              <Row label="Default Layout" description="Preferred viewing mode after a scan finishes.">
                <ViewToggle value={draft.defaultView} onChange={v => set('defaultView', v)} />
              </Row>
              <Row label="Include Folders" description="Show folder size totals alongside files in results.">
                <Toggle checked={!!draft.includeFolders} onChange={v => set('includeFolders', v)} />
              </Row>
              <Row label="Default Sort" description="Column to sort by automatically." last>
                <StyledSelect value={draft.defaultSort} onChange={v => set('defaultSort', v)}>
                  <option value="size|desc">Size (Largest)</option>
                  <option value="size|asc">Size (Smallest)</option>
                  <option value="name|asc">Name (A–Z)</option>
                  <option value="name|desc">Name (Z–A)</option>
                  <option value="modified|desc">Date (Newest)</option>
                  <option value="modified|asc">Date (Oldest)</option>
                </StyledSelect>
              </Row>
            </SectionGroup>
          </div>

          <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800/60">
            <SectionGroup id="scanning" title="Scanning" description="Rules for file discovery." className="px-6 py-6">
              <Row label="Include Hidden Files" description="Analyze files and folders starting with a period.">
                <Toggle checked={draft.includeHidden} onChange={v => set('includeHidden', v)} />
              </Row>
              <Row label="Skip System Folders" description="Ignore Windows and macOS core directories to save time." last>
                <Toggle checked={draft.skipSystem} onChange={v => set('skipSystem', v)} />
              </Row>
            </SectionGroup>

            <SectionGroup id="performance" title="Engine" description="Tune processing speed and resources." className="px-6 py-6">
              <Row label="Concurrent Threads"
                description="Directories evaluated in parallel. SSDs benefit from higher values.">
                <Slider min={4} max={32} step={4} value={draft.concurrency} onChange={v => set('concurrency', v)} />
              </Row>
              <Row label="Batch Size"
                description="Quantity of files pushed to the UI per render cycle." last>
                <Slider min={25} max={500} step={25} value={draft.batchSize} onChange={v => set('batchSize', v)} />
              </Row>
            </SectionGroup>
          </div>

        </div>
      </div>

      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/30 dark:bg-slate-900/10">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-500">Sweepr Version 1.0.0</span>
          {savedFlash && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">✓ Saved</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-500 dark:text-slate-400
                       hover:text-gray-800 dark:hover:text-slate-200 transition-colors rounded-md
                       hover:bg-gray-100 dark:hover:bg-slate-800/50">
            <Icon d={ICONS.refresh} size={11} />
            Restore Defaults
          </button>
          <button onClick={handleSave} disabled={!dirty}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
              dirty
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-default'
            }`}>
            Save Settings
          </button>
        </div>
      </div>

    </div>
  );
}
