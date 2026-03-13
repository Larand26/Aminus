import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import ElectronConfig from "./src/config/ElectronConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  if (!app.isReady()) {
    return;
  }

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

  if (ElectronConfig.isDev || !app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../build/index.html"));
  }
};

const bootstrapMainWindow = () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
};

if (app.isReady()) {
  bootstrapMainWindow();
} else {
  app.once("ready", bootstrapMainWindow);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
