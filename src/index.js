const { app, BrowserWindow } = require('electron');

let dev = process.argv.includes('dev')

let win = null;
function createWindow() {
    if (win == null) {
        if(dev){
            win = new BrowserWindow({
                width: 1200,
                height: 800,
                title:'墨盒音乐',
                icon:'src/img/logo.jpg',
                webPreferences: {webSecurity: false},
            })
            win.on('close', function () {
                win = null;
            }).loadURL('http://localhost:8001/src/html/index.html')
            win.webContents.openDevTools({ mode: 'bottom' })

            console.log('开发模式');
        }else{
            win = new BrowserWindow({
                width:800,
                height:600,
                show:false,
                icon:'src/img/logo.jpg'
            })
            win.on('close',function(){win = null}).once('ready-to-show',function(){
                win.show();
            })
            .loadFile('src/html/index.html');
            console.log(win)
        }
    }
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

