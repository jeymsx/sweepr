const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sweepr', {
  selectFolder:    ()          => ipcRenderer.invoke('dialog:open-directory'),
  openInExplorer:  (p)         => ipcRenderer.invoke('shell:open-path', p),
  showInFolder:    (p)         => ipcRenderer.invoke('shell:show-in-folder', p),
  startScan:       (opts)      => ipcRenderer.invoke('scan:start', opts),
  cancelScan:      ()          => ipcRenderer.invoke('scan:cancel'),
  deleteFiles:     (paths)     => ipcRenderer.invoke('files:delete', paths),
  getDrives:       ()          => ipcRenderer.invoke('drives:list'),
  getAppInfo:      ()          => ipcRenderer.invoke('app:info'),

  onScanBatch:     (cb) => { const fn = (_, d) => cb(d); ipcRenderer.on('scan:batch',    fn); return () => ipcRenderer.removeListener('scan:batch',    fn); },
  onScanProgress:  (cb) => { const fn = (_, d) => cb(d); ipcRenderer.on('scan:progress', fn); return () => ipcRenderer.removeListener('scan:progress', fn); },
  onScanComplete:  (cb) => { const fn = (_, d) => cb(d); ipcRenderer.on('scan:complete', fn); return () => ipcRenderer.removeListener('scan:complete', fn); },
  onScanError:     (cb) => { const fn = (_, d) => cb(d); ipcRenderer.on('scan:error',    fn); return () => ipcRenderer.removeListener('scan:error',    fn); },
});
