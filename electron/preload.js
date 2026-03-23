const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (args) => ipcRenderer.invoke("login", args),
  validateToken: (token) => ipcRenderer.invoke("validate-token", token),
  getProducts: (args) => ipcRenderer.invoke("get-products", args),
  getProductReservations: (args) =>
    ipcRenderer.invoke("get-product-reservations", args),
  getDateReservation: (args) =>
    ipcRenderer.invoke("get-date-reservation", args),
  getProductRegistrations: (args) =>
    ipcRenderer.invoke("get-product-registrations", args),
  getInvoices: (args) => ipcRenderer.invoke("get-invoices", args),
  getOrders: (args) => ipcRenderer.invoke("get-orders", args),
  getOrderItems: (args) => ipcRenderer.invoke("get-order-items", args),
  getClients: (args) => ipcRenderer.invoke("get-clients", args),
  getPhotos: (args) => ipcRenderer.invoke("get-photos", args),
  updatePhoto: (args) => ipcRenderer.invoke("update-photo", args),
  createPhoto: (args) => ipcRenderer.invoke("create-photo", args),
  calculateFreight: (args) => ipcRenderer.invoke("calculate-freight", args),
});
