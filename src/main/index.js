'use strict'

import {
  app, 
  shell,
  BrowserWindow, 
  Menu,
  globalShortcut,
  Tray,
  systemPreferences,
} from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

import { 
  runMonoStereoToggleAction,
  getCurrentValueOfMonoStereo
} from '../utils/monoStereoSwitch'
import { showAudioSwitchedNotification } from '../utils/utils'
import { CHANNELS, SHORTCUTS } from '../utils/constants'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let tray;
let theme;

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
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


// Don't show the app in the doc
app.dock.hide()

const setGlobalShortcuts = () => {
  globalShortcut.register(
    SHORTCUTS.TOGGLE_MONO, 
    runMonoStereoToggleRoutine
  )
}









const createMainWindow = () => {
  const icon = path.join(__dirname, `../assets/icons/png/icon_512x512@2x.png`)
  const window = new BrowserWindow({
    icon,
    width: 400,
    height: 350,
    center: true,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    title: 'Mono Switch',
    webPreferences: {
      backgroundThrottling: false
    }
  })

  if (isDevelopment) {
    // window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.on('blur', () => {
    window.hide()
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
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
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow = window
}

const createTray = () => {
  const themePostfix = theme === 'dark' ? '-dark_theme' : ''
  tray = new Tray(path.join(__dirname, `../assets/images/icon-tray${themePostfix}.png`))
  

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

  getCurrentValueOfMonoStereo((value) => {
    const isMono = value === CHANNELS.MONO
    updateTray(isMono)
  })
}







const showAboutWindow = () => {
  if (!mainWindow) {
    createMainWindow()
  } else {
    mainWindow.show()
  }
}

const updateTheme = () => {
  setOSTheme()
  updateTray()
}

const setOSTheme = () => {
  theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
}

const updateTray = (active = false) => {
  const activePostfix = active ? '-active' : '';
  const themePostfix = theme === 'dark' ? '-dark_theme' : ''
  tray.setImage(path.join(__dirname, `../assets/images/icon-tray${activePostfix}${themePostfix}.png`))
}


const runMonoStereoToggleRoutine = () => {
  runMonoStereoToggleAction((value) => {
    showAudioSwitchedNotification(value)
    const isMono = value === CHANNELS.MONO
    updateTray(isMono)
  })
}
