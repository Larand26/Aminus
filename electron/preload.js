const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (args) => ipcRenderer.invoke("login", args),
  validateToken: (token) => ipcRenderer.invoke("validate-token", token),
  getProducts: (args) => ipcRenderer.invoke("get-products", args),
  getInvoices: (args) => ipcRenderer.invoke("get-invoices", args),
  getOrders: (args) => ipcRenderer.invoke("get-orders", args),
  getOrderItems: (args) => ipcRenderer.invoke("get-order-items", args),
  getClients: (args) => ipcRenderer.invoke("get-clients", args),
});
