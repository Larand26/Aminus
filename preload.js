const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  searchProduto: (arg) => ipcRenderer.send("search-produto", arg),
  onSearchProdutoResponse: (callback) =>
    ipcRenderer.on("search-produto-response", (event, arg) => {
      callback(arg);
    }),
  searchNota: (arg) => ipcRenderer.send("search-nota", arg),
  onSearchNotaResponse: (callback) =>
    ipcRenderer.on("search-nota-response", (event, arg) => {
      callback(arg);
    }),
  searchCliente: (arg) => ipcRenderer.send("search-cliente", arg),
  onSearchClienteResponse: (callback) =>
    ipcRenderer.on("search-cliente-response", (event, arg) => {
      callback(arg);
    }),
});
