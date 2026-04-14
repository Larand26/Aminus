import { app, BrowserWindow, dialog, Menu, autoUpdater } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import "./ipc.js";

import { updateElectronApp } from "update-electron-app";

import ElectronConfig from "./src/config/ElectronConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const devServerUrl = "http://localhost:5173";

if (!ElectronConfig.isDev) {
  updateElectronApp({
    updateInterval: "1 hour",
    notifyUser: false,
  });

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Reiniciar", "Depois"],
      title: "Nova atualização do Aminus",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "Uma versão nova foi encontrada. Reinicie o aplicativo.",
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });
}

const attachRendererDiagnostics = (win) => {
  win.webContents.on("did-fail-load", (_event, code, description, url) => {
    console.error("[renderer] did-fail-load", { code, description, url });
  });

  win.webContents.on("render-process-gone", (_event, details) => {
    console.error("[renderer] render-process-gone", details);
  });

  win.webContents.on("console-message", (_event, details) => {
    const levels = ["log", "warn", "error"];
    const logLevel = levels[details.level] ?? "log";
    console[logLevel]("[renderer:console]", {
      message: details.message,
      line: details.line,
      sourceId: details.sourceId,
    });
  });
};

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
  attachRendererDiagnostics(win);

  if (!app.isPackaged) {
    win.loadURL(devServerUrl).catch((error) => {
      console.warn(
        "[main] Falha ao carregar servidor dev, usando dist/index.html",
        {
          message: error.message,
        },
      );
      win.loadFile(path.join(__dirname, "../dist/index.html"));
    });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
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
