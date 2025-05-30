const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  searchProduto: (arg) => ipcRenderer.send("search-produto", arg),
  onSearchProdutoResponse: (callback) =>
    ipcRenderer.on("search-produto-response", (event, arg) => {
      callback(arg);
    }),
});
