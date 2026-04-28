import { Icon, ICONS } from '../components/common';

const LICENSES = [
  {
    name: 'Electron',
    version: '34.x',
    license: 'MIT',
    description: 'Cross-platform desktop application framework utilizing web technologies.',
    url: 'https://github.com/electron/electron',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    initial: 'E',
  },
  {
    name: 'React',
    version: '18.x',
    license: 'MIT',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    url: 'https://github.com/facebook/react',
    color: 'text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    initial: 'R',
  },
  {
    name: 'Vite',
    version: '6.x',
    license: 'MIT',
    description: 'Next-generation frontend tooling offering highly optimized development builds.',
    url: 'https://github.com/vitejs/vite',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    initial: 'V',
  },
  {
    name: 'Tailwind CSS',
    version: '3.x',
    license: 'MIT',
    description: 'A utility-first CSS framework for rapid and constrained UI development.',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    initial: 'T',
  },
  {
    name: 'Node.js',
    version: 'Bundled via Electron',
    license: 'MIT / ISC',
    description: 'Asynchronous event-driven JavaScript runtime powering the filesystem I/O engines.',
    url: 'https://github.com/nodejs/node',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    initial: 'N',
  },
];

export default function LicensesPage() {
  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Open Source Licenses</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          Sweepr is built on the shoulders of the following open-source projects.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">

        <div className="rounded-2xl border border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27] overflow-hidden">
          {LICENSES.map((lib, i) => (
            <div key={lib.name}
              className={`px-5 py-4 flex items-start gap-4 ${i < LICENSES.length - 1 ? 'border-b border-gray-50 dark:border-slate-800/40' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-medium text-[13px] select-none ${lib.bg} ${lib.color}`}>
                {lib.initial}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <span className="text-[13px] font-medium text-gray-900 dark:text-white">{lib.name}</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">{lib.version}</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 text-[9px] font-medium bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400">
                    {lib.license}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed mb-1.5">{lib.description}</p>
                <a href={lib.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 truncate transition-colors">
                  {lib.url}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-[#161b27]/50 px-6 py-5">
          <p className="text-[12px] font-medium text-gray-900 dark:text-white mb-3">Standard MIT License Notice</p>
          <div className="font-mono text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed space-y-3">
            <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
            <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
          </div>
        </div>

      </div>

    </div>
  );
}