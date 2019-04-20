const { 
  Menu,
  Tray,
  systemPreferences,
} = require('electron')
const path = require('path')
const Notification = require('electron-native-notification')

const { runMonoStereoToggleRoutine } = require('./monoStereoSwitch')
const { 
  iconStereo,
  iconMono,
} = require('./iconBase64')
const { CHANNELS, SHORTCUTS } = require('./constants')

let tray = undefined;
let theme;

const showNotification = (value) => {
  // hide notification in 5 sec or let it stay
  const icon = value === CHANNELS.STEREO ? iconStereo : iconMono
  const notification = new Notification(
    `${value.toUpperCase()} Audio`, 
    { 
      body: `Audio played as ${value.toUpperCase()}`,
      silent: true,
      icon,
      image: icon,
    });
}

const setOSTheme = () => {
  theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
}

const createTray = (window, app) => {
  const themeAddon = theme === 'dark' ? '-dark_theme' : ''
  tray = new Tray(path.join(`app/images/icon-tray${themeAddon}.png`))

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '🧿 Toggle mono', 
      click () {
        runMonoStereoToggleRoutine();
      },
      accelerator: SHORTCUTS.TOGGLE_MONO,
    },
    { type: 'separator' },
    { 
      label: '🦜 About', 
      click () {
        // runMonoStereoToggleRoutine();
      },
      // accelerator: SHORTCUTS.TOGGLE_MONO,
    },
    { 
      label: '🚪 Exit', 
      click () {
        app.quit()
      }
     }
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', function (event) {
    toggleWindow(window)
  })

}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow(window);
}

const showWindow = (window) => {
  const position = getWindowPosition(window);
  window.setPosition(position.x, position.y, false);
  window.show();
}

const getWindowPosition = (window) => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();
  
  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)
  return {x: x, y: y}
}

const updateTray = (active = false) => {
  const activePostfix = active ? '-active' : '';
  const themePostfix = theme === 'dark' ? '-dark_theme' : ''
  tray.setImage(path.join(`app/images/icon-tray${activePostfix}${themePostfix}.png`))
}

module.exports = {
  showNotification,
  updateTray,
  setOSTheme,
  createTray,
}
