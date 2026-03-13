import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

import ElectronConfig from "./src/config/ElectronConfig";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize();

  if (ElectronConfig.isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "build/index.html"));
  }
};

createWindow();
