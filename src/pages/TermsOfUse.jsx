import { Icon, ICONS } from '../components/common';

const TERMS = [
  {
    number: '1',
    title: 'Acceptance & License Grant',
    body: 'By installing, executing, or utilizing Sweepr ("the Software"), you agree to be bound by these Terms of Use. The developer grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Software strictly in accordance with these terms.',
  },
  {
    number: '2',
    title: 'Assumption of Risk & File Deletion',
    body: 'Sweepr provides tools to analyze and bulk-delete files. YOU ARE SOLELY RESPONSIBLE FOR VERIFYING THE FILES YOU SELECT FOR DELETION. Deleting critical operating system files, application directories, or vital documents may result in system instability, application failure, or irrecoverable data loss. Sweepr moves files to the OS Trash/Recycle Bin where possible, but this is not guaranteed for networked drives or oversized files.',
  },
  {
    number: '3',
    title: 'Disclaimer of Warranties (AS-IS)',
    body: 'THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE DEVELOPER DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE, SECURE, OR OPERATE WITHOUT INTERRUPTION.',
  },
  {
    number: '4',
    title: 'Limitation of Liability',
    body: 'IN NO EVENT SHALL THE DEVELOPER, AUTHORS, OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. THIS INCLUDES DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF DATA OR PROFITS).',
  },
  {
    number: '5',
    title: 'Restrictions on Use',
    body: 'You agree not to: (a) intentionally use the Software to disrupt, damage, or compromise the host operating system or network environments; (b) repackage, sell, lease, or distribute the Software without explicit authorization; (c) use the Software for any illegal or unauthorized purpose.',
  },
  {
    number: '6',
    title: 'Modifications & Termination',
    body: 'We reserve the right to modify or replace these Terms at any time. Continued use of the Software after any such changes constitutes your acceptance of the new Terms. This license is effective until terminated by you (by uninstalling the software) or by the developer if you fail to comply with any term.',
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-slate-800/60 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">Terms of Use</h1>
        <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400">
          End User License Agreement (EULA) and usage terms.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-5">

        <div className="rounded-2xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 px-5 py-4 flex items-start gap-3">
          <Icon d={ICONS.about} size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-amber-900 dark:text-amber-200 mb-1">
              Data Destruction Warning
            </p>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
              Sweepr is a powerful utility designed to remove data. Please review your scan results carefully before confirming bulk deletions. We are not responsible for accidentally deleted system registries or personal archives.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#161b27] overflow-hidden">
          {TERMS.map((term, i) => (
            <div key={term.number}
              className={`px-5 py-4 flex gap-4 ${i < TERMS.length - 1 ? 'border-b border-gray-50 dark:border-slate-800/40' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">{term.number}</span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[12px] font-medium text-gray-900 dark:text-white mb-1.5">{term.title}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed uppercase-fallback" style={{textTransform: term.body.includes('AS IS') ? 'none' : 'none'}}>
                  {term.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}