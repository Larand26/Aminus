const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (args) => ipcRenderer.invoke("login", args),
  validateToken: (token) => ipcRenderer.invoke("validate-token", token),
  getProducts: (args) => ipcRenderer.invoke("get-products", args),
});
