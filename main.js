const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
let scanAbortController = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500, height: 800, minWidth: 1500, minHeight: 600,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
    backgroundColor: '#0d1117',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  isDev ? mainWindow.loadURL('http://localhost:5173') : mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  if (!isDev) setupAutoUpdater();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ─── Auto Updater ─────────────────────────────────────────────────────────────

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `Sweepr ${info.version} is available`,
      detail: 'Downloading the update in the background. You\'ll be notified when it\'s ready to install.',
      buttons: ['OK'],
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: `Sweepr ${info.version} has been downloaded`,
      detail: 'Restart Sweepr now to apply the update, or it will be installed automatically on next launch.',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err.message);
  });

  // Check on launch, then every 2 hours
  autoUpdater.checkForUpdates();
  setInterval(() => autoUpdater.checkForUpdates(), 2 * 60 * 60 * 1000);
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

ipcMain.handle('dialog:open-directory', async () => {
  const r = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'], title: 'Select Folder to Scan' });
  return r.canceled ? null : r.filePaths[0];
});

ipcMain.handle('shell:open-path', (_, targetPath) => shell.openPath(targetPath));
ipcMain.handle('shell:show-in-folder', (_, targetPath) => shell.showItemInFolder(targetPath));

// ─── ConcurrentScanner ────────────────────────────────────────────────────────

class ConcurrentScanner {
  constructor({ signal, filters, concurrency, batchSize, progressInterval, onBatch, onProgress }) {
    this.signal           = signal;
    this.filters          = filters;
    this.concurrency      = concurrency      ?? 16;
    this.batchSize        = batchSize        ?? 100;
    this.progressInterval = progressInterval ?? 200;
    this.onBatch          = onBatch;
    this.onProgress       = onProgress;

    this._queue   = [];
    this._active  = 0;
    this._resolve = null;

    this._pendingBatch = [];
    this.totalFiles    = 0;
    this.totalSize     = 0;

    this.dirsQueued    = 0;
    this.dirsProcessed = 0;
    this._startTime    = 0;
    this._lastProgress = 0;
    this._lastDir      = '';
  }

  run(rootDir) {
    this._startTime = Date.now();
    this._enqueue(rootDir);
    return new Promise(resolve => { this._resolve = resolve; this._tick(); });
  }

  _enqueue(dir) {
    this.dirsQueued++;
    this._queue.push(dir);
    this._tick();
  }

  _tick() {
    while (!this.signal.aborted && this._active < this.concurrency && this._queue.length > 0) {
      const dir = this._queue.shift();
      this._active++;
      this._processDir(dir).catch(() => {}).finally(() => {
        this._active--;
        this.dirsProcessed++;
        this._sendProgress();
        if (this._active === 0 && this._queue.length === 0) {
          this._flushBatch(); this._sendProgress(true); this._resolve();
        } else { this._tick(); }
      });
    }
  }

  async _processDir(dir) {
    if (this.signal.aborted) return;
    this._lastDir = dir;

    let entries;
    try { entries = await fs.promises.readdir(dir, { withFileTypes: true }); }
    catch { return; }

    if (this.signal.aborted) return;

    const filePaths = [];
    for (const entry of entries) {
      if (this.signal.aborted) return;
      if (entry.isDirectory()) this._enqueue(path.join(dir, entry.name));
      else if (entry.isFile()) filePaths.push(path.join(dir, entry.name));
    }

    if (filePaths.length === 0) return;

    const statResults = await Promise.allSettled(filePaths.map(fp => fs.promises.stat(fp)));
    if (this.signal.aborted) return;

    const f = this.filters;
    for (let i = 0; i < filePaths.length; i++) {
      const r = statResults[i];
      if (r.status !== 'fulfilled') continue;

      const fullPath = filePaths[i];
      const stat     = r.value;
      const name     = path.basename(fullPath);
      const ext      = path.extname(name).toLowerCase() || '(none)';

      if (f.extSet   && !f.extSet.has(ext))      continue;
      if (f.minSize  &&  stat.size < f.minSize)   continue;
      if (f.maxSize  &&  stat.size > f.maxSize)   continue;
      if (f.dateFrom &&  stat.mtime < f.dateFrom) continue;
      if (f.dateTo   &&  stat.mtime > f.dateTo)   continue;

      this._pendingBatch.push({ id: `${stat.ino}-${fullPath}`, name, fullPath, size: Number(stat.size), modified: stat.mtime.toISOString(), extension: ext });
      this.totalFiles++;
      this.totalSize += Number(stat.size);
      if (this._pendingBatch.length >= this.batchSize) this._flushBatch();
    }
  }

  _flushBatch() {
    if (this._pendingBatch.length === 0) return;
    this.onBatch([...this._pendingBatch], this.totalFiles, this.totalSize);
    this._pendingBatch = [];
  }

  _sendProgress(force = false) {
    const now = Date.now();
    if (!force && now - this._lastProgress < this.progressInterval) return;
    this._lastProgress = now;

    const elapsedMs  = now - this._startTime;
    const elapsedSec = Math.max(elapsedMs / 1000, 0.001);
    const filesPerSec = Math.round(this.totalFiles / elapsedSec);
    const dirsPerSec  = Math.round(this.dirsProcessed / elapsedSec);

    let eta = null;
    if (filesPerSec > 0 && this.dirsProcessed >= 5) {
      const dirsRemaining   = Math.max(0, this.dirsQueued - this.dirsProcessed);
      const avgFilesPerDir  = this.totalFiles / this.dirsProcessed;
      const estRemain       = dirsRemaining * avgFilesPerDir;
      if (estRemain > 0) eta = Math.round(estRemain / filesPerSec);
    }

    this.onProgress({
      filesScanned: this.totalFiles, dirsProcessed: this.dirsProcessed,
      dirsQueued: this.dirsQueued, totalSize: this.totalSize,
      elapsedMs, filesPerSec, dirsPerSec,
      eta, lastDir: this._lastDir,
    });
  }
}

// ─── Scan IPC ─────────────────────────────────────────────────────────────────

ipcMain.handle('scan:cancel', () => { if (scanAbortController) { scanAbortController.abort(); scanAbortController = null; } });

ipcMain.handle('scan:start', async (event, { folderPath, filters }) => {
  if (scanAbortController) scanAbortController.abort();
  scanAbortController = new AbortController();
  const { signal } = scanAbortController;

  const extSet   = filters.extensions?.length > 0 ? new Set(filters.extensions) : null;
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo   = filters.dateTo   ? (() => { const d = new Date(filters.dateTo); d.setHours(23,59,59,999); return d; })() : null;

  const scanner = new ConcurrentScanner({
    signal,
    filters: { extSet, minSize: filters.minSize || 0, maxSize: filters.maxSize || 0, dateFrom, dateTo },
    concurrency: 16, batchSize: 100, progressInterval: 200,
    onBatch: (files, totalFiles, totalSize) => {
      if (!signal.aborted) event.sender.send('scan:batch', { files, totalFiles, totalSize });
    },
    onProgress: (progress) => {
      if (!signal.aborted) event.sender.send('scan:progress', progress);
    },
  });

  try {
    await scanner.run(folderPath);
    if (!signal.aborted) event.sender.send('scan:complete', { totalFiles: scanner.totalFiles, totalSize: scanner.totalSize });
  } catch (err) { event.sender.send('scan:error', err.message); }

  scanAbortController = null;
  return { success: true };
});

// ─── Delete ───────────────────────────────────────────────────────────────────

ipcMain.handle('files:delete', async (_, filePaths) => {
  const results = [];
  for (const p of filePaths) {
    try { await shell.trashItem(p); results.push({ path: p, success: true }); }
    catch (err) { results.push({ path: p, success: false, error: err.message }); }
  }
  return results;
});

// ─── Drives ───────────────────────────────────────────────────────────────────

ipcMain.handle('drives:list', () => new Promise(resolve => {
  if (process.platform === 'win32') {
    const cmd = 'powershell -NoProfile -Command "@(Get-WmiObject Win32_LogicalDisk | Select-Object DeviceID,Size,FreeSpace,VolumeName,FileSystem) | ConvertTo-Json"';
    exec(cmd, { timeout: 8000 }, (err, stdout) => {
      if (err || !stdout.trim()) { resolve([]); return; }
      try {
        const raw = JSON.parse(stdout.trim());
        const arr = Array.isArray(raw) ? raw : [raw];
        resolve(arr.map(d => ({
          name:       d.DeviceID ?? '',
          path:       (d.DeviceID ?? '') + '\\',
          volumeName: d.VolumeName ?? '',
          fileSystem: d.FileSystem ?? '',
          size:       Number(d.Size)      || 0,
          free:       Number(d.FreeSpace) || 0,
          used:       (Number(d.Size) || 0) - (Number(d.FreeSpace) || 0),
        })).filter(d => d.size > 0));
      } catch { resolve([]); }
    });
  } else {
    exec('df -k', { timeout: 5000 }, (err, stdout) => {
      if (err || !stdout) { resolve([]); return; }
      const lines = stdout.trim().split('\n').slice(1);
      resolve(lines.map(l => {
        const p = l.trim().split(/\s+/);
        const size = (parseInt(p[1]) || 0) * 1024;
        const used = (parseInt(p[2]) || 0) * 1024;
        return { name: p[5] ?? p[0], path: p[5] ?? p[0], volumeName: '', fileSystem: '', size, free: size - used, used };
      }).filter(d => d.size > 0 && d.path.startsWith('/')));
    });
  }
}));

// ─── App info ─────────────────────────────────────────────────────────────────

ipcMain.handle('app:info', () => {
  try {
    let osVersion = os.release();

    if (process.platform === 'win32') {
      const build = parseInt(osVersion.split('.')[2], 10);
      if (build >= 22000) {
        osVersion = `Windows 11 (Build ${build})`;
      } else {
        osVersion = `Windows 10 (Build ${build})`;
      }
    }

    const platformMap = {
      win32: 'Windows',
      darwin: 'macOS',
      linux: 'Linux'
    };

    return {
      platform: platformMap[process.platform] ?? process.platform,
      arch: process.arch,
      osVersion,
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromeVersion: process.versions.chrome,
      version: app.getVersion(),
      memory: Math.round(os.totalmem() / (1024 ** 3)) + ' GB',
      cpus: os.cpus().length,
    };

  } catch (err) {
    console.error('app:info error', err);
    return { error: true };
  }
});