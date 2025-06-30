const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // For production, use the built React app
  win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  // Start the Python backend (show output for debugging)
  backendProcess = spawn('python', [path.join(__dirname, '..', 'backend', 'app.py')], {
    shell: true
  });

  backendProcess.stdout && backendProcess.stdout.on('data', data => {
    console.log(`[Backend] ${data}`);
  });
  backendProcess.stderr && backendProcess.stderr.on('data', data => {
    console.error(`[Backend ERROR] ${data}`);
  });

  // Wait a bit to let backend start, then create the window
  setTimeout(createWindow, 1500);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
  if (backendProcess) backendProcess.kill();
});