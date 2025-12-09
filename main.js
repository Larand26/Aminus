const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// SQL Server
const { searchProduto } = require("./db/sqlserver/produtos");
const { searchNotas } = require("./db/sqlserver/notas");
const { searchCliente } = require("./db/sqlserver/clientes");
const { searchPedido, getItensPedido } = require("./db/sqlserver/pedidos");
const { searchReserva } = require("./db/sqlserver/reservas");
const { searchCadastroProdutos } = require("./db/sqlserver/cadastroProdutos");
const { getDataReserva } = require("./db/sqlserver/dataReserva");
const { getCores, createCor } = require("./db/sqlserver/cores");
const { cadastroWeb } = require("./db/sqlserver/cadastroWeb");
const { makeCubagem } = require("./db/sqlserver/cubagem");
<<<<<<< HEAD
const { searchTotalPedidos } = require("./db/sqlserver/totalPedidos");
=======
const { searchTotalPedido } = require("./db/sqlserver/totalPedidos");
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587

// Mongo DB
const { searchFoto } = require("./db/mongodb/fotos");
const { cadastraFotos } = require("./db/mongodb/cadastraFotos");
const { deleteFoto } = require("./db/mongodb/deleteFoto");
const { updateFoto } = require("./db/mongodb/updateFoto");

// My SQL
const { login } = require("./db/mysql/login");

// Transportadoras
const { trackTNT } = require("./transportadoras/trackTNT");
const { track } = require("./transportadoras/track");
const { makeCotacao } = require("./transportadoras/frenet");

// ENV
require("dotenv").config();
let MODE = "production";
try {
  MODE = require("./globals").MODE;
} catch (e) {
  // globals.js não encontrado, segue com o padrão "production"
}

function isDev() {
  return MODE === "development" || process.env.NODE_ENV === "development";
}

const homeWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/logo_png.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize();

  win.setMenuBarVisibility(isDev());

  if (isDev()) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }
};

app.whenReady().then(homeWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("search-produto", async (event, arg) => {
  try {
    const produtos = await searchProduto(arg);
    event.reply("search-produto-response", { data: produtos, success: true });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    event.reply("search-produto-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("search-nota", async (event, arg) => {
  try {
    const notas = await searchNotas(arg);
    event.reply("search-nota-response", notas);
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    event.reply("search-nota-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("search-cliente", async (event, arg) => {
  try {
    const clientes = await searchCliente(arg);
    event.reply("search-cliente-response", clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    event.reply("search-cliente-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-pedido", async (event, arg) => {
  try {
    const pedidos = await searchPedido(arg);
    event.reply("search-pedido-response", pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    event.reply("search-pedido-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("search-reserva", async (event, arg) => {
  try {
    const reservas = await searchReserva(arg);
    event.reply("search-reserva-response", reservas);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    event.reply("search-reserva-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-foto", async (event, arg) => {
  try {
    // Simulação de busca de fotos, substitua com a lógica real
    const fotos = await searchFoto(arg);
    event.reply("search-foto-response", fotos);
  } catch (error) {
    console.error("Erro ao buscar fotos:", error);
    event.reply("search-foto-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("get-itens-pedido", async (event, arg) => {
  try {
    // Simulação de busca de pedido, substitua com a lógica real
    const pedido = await getItensPedido(arg);
    event.reply("get-itens-pedido-response", pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    event.reply("get-itens-pedido-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("make-cubagem", async (event, arg) => {
  try {
    const cubagem = await makeCubagem(arg);
    event.reply("make-cubagem-response", cubagem);
  } catch (error) {
    console.error("Erro ao calcular cubagem:", error);
    event.reply("make-cubagem-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("get-data-reserva", async (event, arg) => {
  try {
    const data = await getDataReserva(arg);
    event.reply("get-data-reserva-response", data);
  } catch (error) {
    console.error("Erro ao buscar dados de reserva:", error);
    event.reply("get-data-reserva-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("cadastra-fotos", async (event, produto) => {
  try {
    // Simulação de cadastro de fotos, substitua com a lógica real
    const response = await cadastraFotos(produto);
    event.reply("cadastra-fotos-response", response);
  } catch (error) {
    console.error("Erro ao cadastrar fotos:", error);
    event.reply("cadastra-fotos-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});
ipcMain.on("delete-foto", async (event, fotoId) => {
  try {
    // Simulação de exclusão de foto, substitua com a lógica real
    const result = await deleteFoto(fotoId);
    event.reply("delete-foto-response", result);
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    event.reply("delete-foto-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("search-cadastro-produtos", async (event, filtros) => {
  try {
    // Simulação de busca de produtos, substitua com a lógica real
    const produtos = await searchCadastroProdutos(filtros);
    event.reply("search-cadastro-produtos-response", produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    event.reply("search-cadastro-produtos-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("login", async (event, { user, password }) => {
  try {
    const result = await login(user, password);
    event.reply("login-response", result);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    event.reply("login-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-rastreamento", async (event, { nota, transportadora }) => {
  try {
    console.log("Buscando rastreamento:", nota, transportadora);
    const result = await track(nota, transportadora);
    event.reply("search-rastreamento-response", result);
  } catch (error) {
    console.error("Erro ao buscar rastreamento:", error);
    event.reply("search-rastreamento-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("get-cores", async (event, descricao) => {
  try {
    // Simulação de busca de cores, substitua com a lógica real
    const cores = await getCores(descricao);
    event.reply("get-cores-response", cores);
  } catch (error) {
    console.error("Erro ao buscar cores:", error);
    event.reply("get-cores-response", { success: false, error, data: [] });
  }
});

ipcMain.on("create-cor", async (event, cor) => {
  try {
    // Simulação de criação de cor, substitua com a lógica real
    const response = await createCor(cor);

    event.reply("create-cor-response", response);
  } catch (error) {
    console.error("Erro ao criar cor:", error);
    event.reply("create-cor-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("cadastra-produtos-web", async (event, produtos) => {
  try {
    // Simulação de cadastro de produtos, substitua com a lógica real
    await cadastroWeb(produtos);
    event.reply("cadastra-produtos-web-response", { success: true });
  } catch (error) {
    console.error("Erro ao cadastrar produtos:", error);
    event.reply("cadastra-produtos-web-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("make-cotacao", async (event, arg) => {
  try {
    const cotacao = await makeCotacao(arg);
    event.reply("make-cotacao-response", cotacao);
  } catch (error) {
    console.error("Erro ao fazer cotação:", error);
    event.reply("make-cotacao-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("update-foto", async (event, novaFoto) => {
  try {
    const result = await updateFoto(novaFoto);
    event.reply("update-foto-response", result);
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    event.reply("update-foto-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

<<<<<<< HEAD
ipcMain.on("search-total-pedidos", async (event, filters) => {
  try {
    const totalPedidos = await searchTotalPedidos(filters);
    event.reply("search-total-pedidos-response", totalPedidos);
  } catch (error) {
    console.error("Erro ao buscar total de pedidos:", error);
    event.reply("search-total-pedidos-response", {
=======
ipcMain.on("search-total-pedido", async (event, arg) => {
  try {
    const totalPedidos = await searchTotalPedido(arg);
    event.reply("search-total-pedido-response", totalPedidos);
  } catch (error) {
    console.error("Erro ao buscar total de pedidos:", error);
    event.reply("search-total-pedido-response", {
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});
