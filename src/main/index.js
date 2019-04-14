import { app, BrowserWindow, globalShortcut,Menu,Tray } from 'electron'

let appIcon = null
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 600,
    minWidth:260,
    minHeight:200,
    icon: `${__static}/256x256.png`,
    backgroundColor: '#222933',
    frame: process.env.NODE_ENV === 'development',
    webPreferences: {
      webSecurity: false,

    },
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow();

  globalShortcut.register('Alt+Shift+S', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else
      mainWindow.show();
  })

  //添加系统托盘以确定是否程序正在运行
  appIcon = new Tray(`${__static}/256x256.png`)
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Item1', type: 'radio' },
    // { label: 'Item2', type: 'radio' }
    {label:'显示界面',type:'normal',click:(menu,window,event)=>{
      // window.show();
      mainWindow.show();
    }}
  ])

  // // Make a change to the context menu
  // // contextMenu.items[1].checked = false

  // // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
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

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  console.log('第二个实例退出')
  app.quit()
}

// console.log(app.requestSingleInstanceLock())
// const single = app.requ

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
