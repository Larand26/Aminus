const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const env = require("dotenv");
const { searchProduto } = require("./db/produtos");
const { searchNotas } = require("./db/notas");

env.config();

function isDev() {
  return (
    process.env.NODE_ENV === "development" || process.argv.includes("--dev")
  );
}

const homeWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev()) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
};

app.whenReady().then(homeWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("search-produto", async (event, arg) => {
  try {
    const produtos = await searchProduto(arg);
    event.reply("search-produto-response", produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
});

ipcMain.on("search-nota", async (event, arg) => {
  try {
    const notas = await searchNota(arg);
    event.reply("search-nota-response", notas);
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  }
});
