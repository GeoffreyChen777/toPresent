const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, presWindow;
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog

function createPresWindow() {
    var presWindow = new BrowserWindow({
        width: 300,
        height: 300,
        show: false,
        frame: false,
    })

    presWindow.setFullScreen(true);
    presWindow.webContents.openDevTools()
    presWindow.loadURL(__dirname + './windows/view/fullscreen.html') //新窗口
    return presWindow;
}

function bindCloseMethod(win) {
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false,
        icon: path.join(__dirname, "../assets/icon.ico")
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, './windows/view/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    win.webContents.openDevTools()
    win.setMenu(null);
    // Emitted when the window is closed.

    presWindow = createPresWindow();

    ipc.on('pres-show', (event, arg) => {
        if (presWindow == null) {
            presWindow = createPresWindow();
        }
        bindCloseMethod(presWindow);
        presWindow.show();
        presWindow.webContents.send('pres-data', arg);
    })

    ipc.on('hide-pres', function () {
        presWindow.hide()
    })

    ipc.on('open-file-dialog', function (event) {
        dialog.showOpenDialog({
            filters: [{
                name: 'markdown',
                extensions: ['md']
            }],
            properties: ['openFile']
        }, function (files) {
            if (files) event.sender.send('selected-directory', files)
        })
    })

    ipc.on('open-if-save-dialog', function (event) {
        const options = {
            type: 'info',
            title: 'Save or not',
            message: "You have not saved your changes yet, save it?",
            buttons: ['Save', 'Exit']
        }
        dialog.showMessageBox(options, function (index) {
            event.sender.send('if-save-dialog-selection', index)
        })
    })

    ipc.on('save-dialog', function (event) {
        const options = {
            title: 'Save Markdown',
            filters: [{
                name: 'name',
                extensions: ['md']
            }]
        }
        dialog.showSaveDialog(options, function (filename) {
            event.sender.send('saved-file', filename)
        })
    })

    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        presWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.