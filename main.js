const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// SQL Server
const { searchProduto } = require("./db/sqlserver/produtos");
const { searchNotas } = require("./db/sqlserver/notas");
const { searchCliente } = require("./db/sqlserver/clientes");
const { searchPedido, getPedido } = require("./db/sqlserver/pedidos");
const { searchReserva } = require("./db/sqlserver/reservas");
const { searchCadastroProdutos } = require("./db/sqlserver/cadastroProdutos");
const { getDataReserva } = require("./db/sqlserver/dataReserva");
const { makeCubagem } = require("./db/sqlserver/cubagem");

// Mongo DB
const { searchFoto } = require("./db/mongodb/fotos");
const { cadastraFotos } = require("./db/mongodb/cadastraFotos");
const { deleteFoto } = require("./db/mongodb/deleteFoto");

// My SQL
const { getCsv } = require("./excel/getCsv");
const { insertCsvMysql } = require("./db/mysql/insertCsvMysql");
const { getControlePlaza } = require("./db/mysql/getControlePlaza");
const { changeAcao } = require("./db/mysql/changeAcao");
const { changeDataRepasse } = require("./db/mysql/changeDataRepasse");
const { login } = require("./db/mysql/login");

// Transportadoras
const { trackTNT } = require("./transportadoras/trackTNT");

// ENV
require("dotenv").config();

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
    event.reply("search-produto-response", produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
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
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("get-pedido", async (event, arg) => {
  try {
    // Simulação de busca de pedido, substitua com a lógica real
    const pedido = await getPedido(arg);
    event.reply("get-pedido-response", pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    event.reply("get-pedido-response", {
      error: error.message || "Erro desconhecido",
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

ipcMain.on(
  "get-data-reserva",
  async (event, { idCodProduto, idNumPedOrc, dataPesquisa }) => {
    try {
      // Simulação de busca de dados de reserva, substitua com a lógica real
      const data = await getDataReserva(
        idCodProduto,
        idNumPedOrc,
        dataPesquisa
      );
      event.reply("get-data-reserva-response", data);
    } catch (error) {
      console.error("Erro ao buscar dados de reserva:", error);
      event.reply("get-data-reserva-response", {
        error: error.message || "Erro desconhecido",
      });
    }
  }
);

ipcMain.on("cadastra-fotos", async (event, produto) => {
  try {
    // Simulação de cadastro de fotos, substitua com a lógica real
    await cadastraFotos(produto);
    event.reply("cadastra-fotos-response", { success: true });
  } catch (error) {
    console.error("Erro ao cadastrar fotos:", error);
    event.reply("cadastra-fotos-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});
ipcMain.on("delete-foto", async (event, foto) => {
  try {
    // Simulação de exclusão de foto, substitua com a lógica real
    await deleteFoto(foto);
    event.reply("delete-foto-response", { success: true });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    event.reply("delete-foto-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("get-csv", async (event, arg) => {
  try {
    // Simulação de busca de CSV, substitua com a lógica real
    const csvData = await getCsv(arg);
    await insertCsvMysql(csvData);
    const result = await getControlePlaza();
    event.reply("get-csv-response", result);
  } catch (error) {
    console.error("Erro ao buscar CSV:", error);
    event.reply("get-csv-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("change-acao", async (event, arg) => {
  try {
    // Simulação de alteração de ação, substitua com a lógica real
    const result = await changeAcao(arg);
    if (arg.acao === 1) {
      await changeDataRepasse(arg.id);
    }
    event.reply("change-acao-response", result);
  } catch (error) {
    console.error("Erro ao alterar ação:", error);
    event.reply("change-acao-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-cadastro-produtos", async (event, referencia) => {
  try {
    // Simulação de busca de produtos, substitua com a lógica real
    const produtos = await searchCadastroProdutos(referencia);
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
