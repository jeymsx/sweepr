import { Icon, ICONS } from '../components/common';

const SECTIONS = [
  {
    title: '1. Zero Data Collection & Telemetry',
    icon: ICONS.scanner,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    body: 'Sweepr is designed with a privacy-first architecture. The application does not collect, record, or transmit any personal data. We have intentionally excluded all forms of analytics, telemetry, remote crash reporting, and usage tracking. What happens on your device stays entirely on your device.',
  },
  {
    title: '2. Local File System Access',
    icon: ICONS.folder,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    body: 'To function as a disk space analyzer, Sweepr requires permission to access your local file system. The application reads file metadata—such as file names, sizes, extension types, modification dates, and directory paths. This metadata is processed strictly in your system\'s volatile memory (RAM) during a scan and is never uploaded to any external server.',
  },
  {
    title: '3. App Preferences & Local Storage',
    icon: ICONS.drive,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    body: 'Sweepr utilizes your operating system\'s local storage mechanisms (e.g., localStorage within the Electron runtime) to save your user preferences. This includes your dark mode toggle, layout views, custom filter configurations, and recent scan history logs. You maintain full control over this data and can clear it at any time via the application settings.',
  },
  {
    title: '4. File Deletion & Modification',
    icon: ICONS.trash,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    body: 'When you execute a deletion command within Sweepr, the application leverages native OS APIs (Node.js shell commands) to move files to your system\'s Recycle Bin or Trash. Sweepr does not read the contents of your files prior to deletion, nor does it retain backup copies. Permanent deletion is handled entirely by your operating system.',
  },
  {
    title: '5. No Third-Party Integrations',
    icon: ICONS.lock,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    body: 'Because Sweepr operates 100% offline, there are no third-party integrations, advertising SDKs, tracking pixels, or data brokers embedded within the application. We do not share, sell, or rent any information because we do not collect any information.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          Effective Date: April 28, 2026
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-5">

        <div className="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 px-5 py-4 flex items-start gap-3">
          <Icon d={ICONS.lock} size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-blue-900 dark:text-blue-200 mb-1">
              Your privacy is cryptographically guaranteed by architecture.
            </p>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              Sweepr is a completely offline desktop application. It does not contain network request code to phone home. We cannot see your files, your scans, or your usage habits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {SECTIONS.map(s => (
            <div key={s.title}
              className="rounded-2xl border border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27] px-5 py-4 flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.bg}`}>
                <Icon d={s.icon} size={14} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-gray-900 dark:text-white mb-1.5">{s.title}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27] px-5 py-4">
          <p className="text-[11px] font-medium text-gray-900 dark:text-white mb-1">Policy Updates & Contact</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
            We may update this Privacy Policy as new features are added to Sweepr. Because the app is offline, any policy changes will be bundled directly with future software updates. If you have questions regarding our data practices, please open an issue on our official GitHub repository.
          </p>
        </div>

      </div>
    </div>
  );
}