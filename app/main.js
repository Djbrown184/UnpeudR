const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const ipc = ipcMain

const env = process.env.NODE_ENV || 'development';

const debug = /--debug/.test(process.argv[4])

let mainWindow

function initialize () {
    function createWindow () {
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName(),
            frame: true,
            webPreferences: {
                nodeIntegration: true,
                contextIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            }
        }

        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
        }

        mainWindow = new BrowserWindow(windowOptions)
        mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

        // Launch fullscreen with DevTools open, usage: npm run debug
        if (env === 'development') {
            try {
                require('electron-reloader')(module, {
                    debug: true,
                    watchRenderer: true
                });
            } catch (_) { console.log('Error'); }    
        }

        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
            require('devtron').install()
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })
    }

    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    })
}

initialize()