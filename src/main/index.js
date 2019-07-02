"use strict";

import {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  Tray,
  systemPreferences
} from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import log from "electron-log";
// import { autoUpdater } from "electron-updater";

import {
  runMonoStereoToggleAction,
  getCurrentValueOfMonoStereo
} from 'common/monoStereoSwitch'
import {
  showAudioSwitchedNotification,
} from "common/utils";
import { CHANNELS, SHORTCUTS } from "common/constants";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let tray;
let theme;
let isStereo = true;

log.info("🛫 App started...");

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  if (process.platform === "darwin") {
    setOSTheme();
    systemPreferences.subscribeNotification(
      "AppleInterfaceThemeChangedNotification",
      updateTheme
    );
  }
  createTray();
  setGlobalShortcuts();
});

// Don't show the app in the doc
app.dock.hide()

const setGlobalShortcuts = () => {
  globalShortcut.register(SHORTCUTS.TOGGLE_MONO, runMonoStereoToggleRoutine);
};

const createMainWindow = () => {
  const icon = path.join(__static, `/icons/png/icon_512x512@2x.png`);
  const window = new BrowserWindow({
    icon,
    width: 400,
    height: 350,
    center: true,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    title: "Mono Switch",
    webPreferences: {
      backgroundThrottling: false
    }
  });

  if (isDevelopment) {
    // window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__static, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.on("blur", () => {
    window.hide();
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Toggle mono",
          click() {
            runMonoStereoToggleRoutine();
          },
          accelerator: SHORTCUTS.TOGGLE_MONO
        },
        { type: "separator" },
        {
          label: "About",
          click() {
            showAboutWindow();
          }
        },
        {
          label: "Quit Mono Switcher",
          click() {
            app.quit();
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow = window;
};

const createTray = () => {
  const themePostfix = theme === "dark" ? "-dark_theme" : "";
  tray = new Tray(path.join(__static, `/images/icon-tray${themePostfix}.png`));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Toggle mono",
      click() {
        runMonoStereoToggleRoutine();
      },
      accelerator: SHORTCUTS.TOGGLE_MONO
    },
    { type: "separator" },
    {
      label: "About",
      click() {
        showAboutWindow();
      }
    },
    {
      label: "Quit Switcher",
      click() {
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  getCurrentValueOfMonoStereo(value => {
    isStereo = value === CHANNELS.STEREO;
    updateTray(isStereo);
  });
};

const showAboutWindow = () => {
  if (!mainWindow) {
    createMainWindow();
  } else {
    mainWindow.show();
  }
};

const updateTheme = () => {
  setOSTheme();
  updateTray();
};

const setOSTheme = () => {
  theme = systemPreferences.isDarkMode() ? "dark" : "light";
};

const updateTray = (isStereo = true) => {
  log.info("⚀ routine: updating tray...");
  const monoPostfix = !isStereo ? "-mono" : "";
  const themePostfix = theme === "dark" ? "-dark_theme" : "";
  tray.setImage(
    path.join(__static, `/images/icon-tray${monoPostfix}${themePostfix}.png`)
  );
};

const runMonoStereoToggleRoutine = () => {
  // toggle audio, then update UI regards previous state, 
  // then confirm this changes is correct
  runMonoStereoToggleAction(() => optimisticTrayUpdate(isStereo), confirmTrayUpdate);
};

// update tray based on previous known state
const optimisticTrayUpdate = (isStereo) => {
  const newValue = !isStereo;
  const value = newValue ? CHANNELS.STEREO : CHANNELS.MONO;
  showAudioSwitchedNotification(value);
  updateTray(isStereo);
};

// this action takes some time, so we run after UI update
const confirmTrayUpdate = value => {
  isStereo = value === CHANNELS.STEREO;
  updateTray(isStereo);
};
