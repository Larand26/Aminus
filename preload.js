const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendOi: () => ipcRenderer.send("oi-do-frontend"),
});
