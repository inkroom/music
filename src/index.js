const { app, BrowserWindow } = require('electron');


let win = null;
function createWindow() {
    if (win == null) {
        win = new BrowserWindow({
            width: 800,
            height: 600
        })


        win.on('close', function () {
            win = null;
        }).loadFile('src/html/index.html')
    }
    win.show();
    win.webContents.openDevTools({ mode: 'detach' })
}

//解决音频不能自动播放限制
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.on('ready', function () {
    createWindow();
})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    createWindow();
})

