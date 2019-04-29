const { 
  app, 
  shell,
  BrowserWindow, 
  Menu,
  globalShortcut,
  Tray,
  systemPreferences,
} = require('electron')
const { runMonoStereoToggleAction } = require('./monoStereoSwitch')
const { 
  showNotification, 
} = require('./utils')
const { CHANNELS, SHORTCUTS } = require('./constants')
const path = require('path')

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname, {
  //   // Enable live reload for Electron too
  //   // Starting new electron process
  //   // Note that the path to electron may vary according to the main file
  //   electron: require(`${__dirname}/node_modules/electron`)
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;
let tray = undefined;
let theme;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (process.platform === 'darwin') {
    setOSTheme()
    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      updateTheme,
      )
  }
  createTray()
  setGlobalShortcuts()
})

const updateTheme = () => {
  setOSTheme()
  updateTray()
}

// Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
})

// Don't show the app in the doc
app.dock.hide()

const setGlobalShortcuts = () => {
  globalShortcut.register(
    SHORTCUTS.TOGGLE_MONO, 
    runMonoStereoToggleRoutine
  )
}


const createWindow = () => {
  window = new BrowserWindow({
    width: 400,
    height: 350,
    center: true,
    icon: 'app/assets/icons/png/icon_512x512@2x.png',
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    title: 'Mono Switch',
    webPreferences: {
      backgroundThrottling: false
    }
  })
  window.loadFile('app/index.html')
  window.once('ready-to-show', () => {
    window.show()
  })
  window.on('closed', () => {
    window = null  
  })
  window.on('blur', () => {
    window.hide()
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        { 
          label: '🦊 Toggle mono',
          click () {
            // showNotification();
          },
          accelerator: SHORTCUTS.TOGGLE_MONO,
        },
        { type: 'separator' },
        { 
          label: '🧿 Exit', 
          click () {
            app.quit()
          }
        },
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}



const createTray = () => {
  const themeAddon = theme === 'dark' ? '-dark_theme' : ''
  tray = new Tray(path.join(`app/images/icon-tray${themeAddon}.png`))

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Toggle mono', 
      click () {
        runMonoStereoToggleRoutine();
      },
      accelerator: SHORTCUTS.TOGGLE_MONO,
    },
    { type: 'separator' },
    { 
      label: 'About', 
      click () {
        showAboutWindow()
      },
    },
    { 
      label: 'Quit Switcher', 
      click () {
        app.quit()
      }
     }
  ])
  tray.setContextMenu(contextMenu)
}

const showAboutWindow = () => {
  if (!window) {
    createWindow()
  } else {
    window.show()
  }
}

const updateTray = (active = false) => {
  const activePostfix = active ? '-active' : '';
  const themePostfix = theme === 'dark' ? '-dark_theme' : ''
  tray.setImage(path.join(`app/images/icon-tray${activePostfix}${themePostfix}.png`))
}


const setOSTheme = () => {
  theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
}

const runMonoStereoToggleRoutine = () => {
  runMonoStereoToggleAction((value) => {
    showNotification(value)
    updateTray(value === CHANNELS.MONO)
  })
}
