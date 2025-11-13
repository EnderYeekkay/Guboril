const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('./public/mainwindow/mainwindow.html')
  win.webContents.openDevTools({ mode: 'detach' }); // отдельное окно
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})