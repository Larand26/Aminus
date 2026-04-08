import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import "./ipc.js";

import ElectronConfig from "./src/config/ElectronConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const attachContextMenu = (win) => {
  win.webContents.on("context-menu", (_event, params) => {
    const template = [];

    if (params.isEditable) {
      template.push(
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
        { type: "separator" },
        { role: "selectAll", label: "Selecionar Tudo" },
      );
    } else if (params.selectionText?.trim()) {
      template.push(
        { role: "copy", label: "Copiar" },
        { type: "separator" },
        { role: "selectAll", label: "Selecionar Tudo" },
      );
    }

    if (template.length > 0) {
      Menu.buildFromTemplate(template).popup({ window: win });
    }
  });
};

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
  attachContextMenu(win);

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
