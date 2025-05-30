const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const env = require("dotenv");

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

ipcMain.on("search-produto", (event, arg) => {
  console.log(arg);
});
