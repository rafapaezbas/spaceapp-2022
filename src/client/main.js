const remoteMain = require('@electron/remote/main')
const {app, BrowserWindow} = require('electron')

function createWindow() {

    remoteMain.initialize();

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            plugins: true,
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            nativeWindowOpen: false,
            webSecurity: false
        }
    })

    remoteMain.enable(win.webContents);

    win.loadFile('./src/client/index.html')
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
