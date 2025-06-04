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
  searchPedido: (arg) => ipcRenderer.send("search-pedido", arg),
  onSearchPedidoResponse: (callback) =>
    ipcRenderer.on("search-pedido-response", (event, arg) => {
      callback(arg);
    }),
  searchReserva: (arg) => ipcRenderer.send("search-reserva", arg),
  onSearchReservaResponse: (callback) =>
    ipcRenderer.on("search-reserva-response", (event, arg) => {
      callback(arg);
    }),
  searchFoto: (arg) => ipcRenderer.send("search-foto", arg),
  onSearchFotoResponse: (callback) =>
    ipcRenderer.on("search-foto-response", (event, arg) => {
      callback(arg);
    }),
  getPedido: (arg) => ipcRenderer.send("get-pedido", arg),
  onGetPedidoResponse: (callback) =>
    ipcRenderer.on("get-pedido-response", (event, arg) => {
      callback(arg);
    }),
  makeCubagem: (arg) => ipcRenderer.send("make-cubagem", arg),
  onMakeCubagemResponse: (callback) =>
    ipcRenderer.on("make-cubagem-response", (event, arg) => {
      callback(arg);
    }),
});
