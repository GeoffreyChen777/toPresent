const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, pres_win, css_setting_win;
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog

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
        frame: false
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/windows/view/index.html'),
        protocol: 'file:',
        slashes: true
    }))


    win.setMenu(null);

    pres_win = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        show: false
    });
    pres_win.loadURL(url.format({
        pathname: path.join(__dirname + '/windows/view/fullscreen.html'),
        protocol: 'file:',
        slashes: true
    }));

    css_setting_win = new BrowserWindow({
        width: 450,
        height: 300,
        frame: false,
        show: false,
        parent: win
    });
    css_setting_win.loadURL(url.format({
        pathname: path.join(__dirname + '/windows/view/css_setting.html'),
        protocol: 'file:',
        slashes: true
    }));
    //win.webContents.openDevTools();

    //pres_win.webContents.openDevTools();

    //css_setting_win.webContents.openDevTools();
    ipc.on('pres-show', (event, arg) => {
        pres_win.setFullScreen(true);
        pres_win.show();
        pres_win.webContents.send('pres-data', arg);
    })

    ipc.on('hide-pres', function () {
        pres_win.hide();
    })

    ipc.on('css_setting-show', (event, arg) => {
        css_setting_win.show();
    })

    ipc.on('hide-css_setting', function () {
        css_setting_win.hide();
    })

    ipc.on('css_setting_path', (event, arg) => {
        win.webContents.send('send_css_setting_path', arg);
    })

    ipc.on('add-css', (event, arg) => {

        win.webContents.insertCSS(arg);
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

    ipc.on('open-css-dialog', function (event) {
        dialog.showOpenDialog({
            filters: [{
                name: 'CSS',
                extensions: ['css']
            }],
            properties: ['openFile']
        }, function (files) {
            if (files) event.sender.send('selected-css-file', files)
        })
    })

    ipc.on('exit-if-save-dialog', function (event) {
        const options = {
            type: 'info',
            title: 'Save or not',
            message: "You have not saved your changes yet, save it?",
            buttons: ['Save', 'Exit']
        }
        dialog.showMessageBox(options, function (index) {
            event.sender.send('exit-if-save-dialog-selection', index)
        })
    })

    ipc.on('open-if-save-dialog', function (event) {
        const options = {
            type: 'info',
            title: 'Save or not',
            message: "You have not saved your changes yet, save it?",
            buttons: ['Save', "Don't Save"]
        }
        dialog.showMessageBox(options, function (index) {
            event.sender.send('open-if-save-dialog-selection', index)
        })
    })

    ipc.on('save-dialog', function (event) {
        const options = {
            title: 'Save Markdown',
            filters: [{
                name: 'markdown',
                extensions: ['md']
            }]
        }
        dialog.showSaveDialog(options, function (filename) {
            event.sender.send('saved-file', filename)
        })
    });

    ipc.on('export-html-dialog', function (event) {
        const options = {
            title: 'Export HTML',
            filters: [{
                name: 'HTML',
                extensions: ['html']
            }]
        }
        dialog.showSaveDialog(options, function (filename) {
            event.sender.send('export-html-file', filename)
        })
    })



    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        pres_win = null
    });
    bindCloseMethod(pres_win)
    bindCloseMethod(css_setting_win)
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