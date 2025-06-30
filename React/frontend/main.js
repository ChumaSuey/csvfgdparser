const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // For development, use localhost:3000
  // win.loadURL('http://localhost:3000');

  // For production, use the built React app
  win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  // Start the Python backend (adjust the path if needed)
  backendProcess = spawn('python', [path.join(__dirname, '..', 'backend', 'app.py')], {
    shell: true,
    detached: true,
    stdio: 'ignore'
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
  if (backendProcess) backendProcess.kill();
});