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
  removeSearchFotoResponse: (callback) =>
    ipcRenderer.removeListener("search-foto-response", (event, arg) => {
      callback(arg);
    }),
  getItensPedido: (arg) => ipcRenderer.send("get-itens-pedido", arg),
  onGetItensPedidoResponse: (callback) =>
    ipcRenderer.on("get-itens-pedido-response", (event, arg) => {
      callback(arg);
    }),
  makeCubagem: (arg) => ipcRenderer.send("make-cubagem", arg),
  onMakeCubagemResponse: (callback) =>
    ipcRenderer.on("make-cubagem-response", (event, arg) => {
      callback(arg);
    }),
  getDataReserva: (idCodProduto, idNumPedOrc, dataPesquisa) =>
    ipcRenderer.send("get-data-reserva", {
      idCodProduto,
      idNumPedOrc,
      dataPesquisa,
    }),
  onGetDataReservaResponse: (callback) =>
    ipcRenderer.on("get-data-reserva-response", (event, arg) => {
      callback(arg);
    }),
  cadastraFotos: (produto) => ipcRenderer.send("cadastra-fotos", produto),
  onCadastraFotosResponse: (callback) =>
    ipcRenderer.on("cadastra-fotos-response", (event, arg) => {
      callback(arg);
    }),
  deleteFoto: (foto) => ipcRenderer.send("delete-foto", foto),
  onDeleteFotoResponse: (callback) =>
    ipcRenderer.on("delete-foto-response", (event, arg) => {
      callback(arg);
    }),
  getCsv: (arg) => ipcRenderer.send("get-csv", arg),
  onGetCsvResponse: (callback) =>
    ipcRenderer.on("get-csv-response", (event, arg) => {
      callback(arg);
    }),
  changeAcao: (acao, id) => ipcRenderer.send("change-acao", { acao, id }),
  onChangeAcaoResponse: (callback) =>
    ipcRenderer.on("change-acao-response", (event, arg) => {
      callback(arg);
    }),
  searchCadastroProdutos: (referencia) =>
    ipcRenderer.send("search-cadastro-produtos", referencia),
  onSearchCadastroProdutosResponse: (callback) =>
    ipcRenderer.on("search-cadastro-produtos-response", (event, arg) => {
      callback(arg);
    }),
  login: (user, password) => ipcRenderer.send("login", { user, password }),
  onLoginResponse: (callback) =>
    ipcRenderer.on("login-response", (event, arg) => {
      callback(arg);
    }),
  searchRastreamento: (arg) => ipcRenderer.send("search-rastreamento", arg),
  onSearchRastreamentoResponse: (callback) =>
    ipcRenderer.on("search-rastreamento-response", (event, arg) => {
      callback(arg);
    }),
  getCores: (arg) => ipcRenderer.send("get-cores", arg),
  onGetCoresResponse: (callback) =>
    ipcRenderer.on("get-cores-response", (event, arg) => {
      callback(arg);
    }),
  createCor: (cor) => ipcRenderer.send("create-cor", cor),
  onCreateCorResponse: (callback) =>
    ipcRenderer.on("create-cor-response", (event, arg) => {
      callback(arg);
    }),

  cadastraProdutosWeb: (produtos) =>
    ipcRenderer.send("cadastra-produtos-web", produtos),
  onCadastraProdutosWebResponse: (callback) =>
    ipcRenderer.on("cadastra-produtos-web-response", (event, arg) => {
      callback(arg);
    }),

  makeCotacao: (arg) => ipcRenderer.send("make-cotacao", arg),
  onMakeCotacaoResponse: (callback) =>
    ipcRenderer.on("make-cotacao-response", (event, arg) => {
      callback(arg);
    }),
});
