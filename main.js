const { app, BrowserWindow, ipcMain, session } = require("electron");
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
const { searchTotalPedidos } = require("./db/sqlserver/totalPedidos");

// Mongo DB
const { searchFoto } = require("./db/mongodb/fotos");
const { cadastraFotos } = require("./db/mongodb/cadastraFotos");
const { deleteFoto } = require("./db/mongodb/deleteFoto");
const { updateFoto } = require("./db/mongodb/updateFoto");

// My SQL
const { login } = require("./db/mysql/login");
const {
  pegaContatos,
  adicionaContato,
  editaContato,
} = require("./db/mysql/contatos");
const {
  pegaKeys,
  atualizaUltimoUsoKey,
  pegaUltimoUsoKey,
} = require("./db/mysql/keys");
const { salvaInfos, pegaInfos } = require("./db/mysql/dashboardWpp");

// Transportadoras
const { trackTNT } = require("./transportadoras/trackTNT");
const { track } = require("./transportadoras/track");
const { makeCotacao } = require("./transportadoras/frenet");

// Gemini
const { pegaRespostaGemini } = require("./gemini/gemini");

// ENV
require("dotenv").config();
let MODE = "production";
try {
  MODE = require("./globals").MODE;
} catch (e) {
  // globals.js não encontrado, segue com o padrão "production"
}

// Token
const { geraToken } = require("./token/geraToken");
const { verificaToken } = require("./token/verificaToken");

// Vendededores
const vendedoresJson = require("./db/vendedores.json");

// Whatsapp
const { enviaMensagem, enviaImagens } = require("./whatsapp/mensagem");

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
    const tokenResult = await verificaToken(arg.token);
    if (!tokenResult.success) event.reply("search-nota-response", tokenResult);

    if (tokenResult.data.ID_FUNCAO_USUARIO == 2) {
      const idVendedor = vendedoresJson.find(
        (v) => v.label === tokenResult.data.NOME,
      )?.value;
      arg.vendedor = idVendedor || "";
    }

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
    const tokenResult = await verificaToken(arg.token);
    if (!tokenResult.success) event.reply("search-nota-response", tokenResult);

    if (tokenResult.data.ID_FUNCAO_USUARIO == 2) {
      const idVendedor = vendedoresJson.find(
        (v) => v.label === tokenResult.data.NOME,
      )?.value;
      arg.vendedor = idVendedor || "";
    }

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

ipcMain.on("login", async (event, { user, password, semExpiracao }) => {
  try {
    const loginResult = await login(user, password);
    if (!loginResult.success) event.reply("login-response", loginResult);
    const tokenResult = await geraToken(
      {
        ID_USUARIO: loginResult.data.ID_USUARIO,
        NOME: loginResult.data.NOME,
        DESCRICAO_FUNCAO: loginResult.data.DESCRICAO_FUNCAO,
        ID_FUNCAO_USUARIO: loginResult.data.ID_FUNCAO_USUARIO,
      },
      semExpiracao || false,
    );
    if (!tokenResult.success) return event.reply("login-response", tokenResult);
    const result = {
      success: true,
      data: {
        token: tokenResult.data,
        NOME: loginResult.data.NOME,
        DESCRICAO_FUNCAO: loginResult.data.DESCRICAO_FUNCAO,
        ID_FUNCAO: loginResult.data.ID_FUNCAO_USUARIO,
        // outros campos simples...
      },
    };
    event.reply("login-response", result);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    event.reply("login-response", {
      success: false,
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
    console.error("Erro ao progressoizar foto:", error);
    event.reply("update-foto-response", {
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-total-pedidos", async (event, filtros) => {
  try {
    const totalPedidos = await searchTotalPedidos(filtros);
    event.reply("search-total-pedidos-response", totalPedidos);
  } catch (error) {
    console.error("Erro ao buscar total de pedidos:", error);
    event.reply("search-total-pedidos-response", {
      error: error.message || "Erro desconhecido",
      success: false,
    });
  }
});

ipcMain.on("pega-resposta-gemini", async (event, { pergunta, respostas }) => {
  try {
    const resposta = await pegaRespostaGemini(pergunta, respostas);
    event.reply("pega-resposta-gemini-response", resposta);
  } catch (error) {
    console.error("Erro ao obter resposta do Gemini:", error);
    event.reply("pega-resposta-gemini-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("autentica-token", async (event, token) => {
  try {
    const resultado = await verificaToken(token);
    event.reply("autentica-token-response", resultado);
  } catch (error) {
    console.error("Erro ao autenticar token:", error);
    event.reply("autentica-token-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("envia-mensagem", async (event, args) => {
  try {
    const tokenResult = await verificaToken(args.token);
    if (!tokenResult.success)
      return event.reply("envia-mensagem-response", tokenResult);

    const contatosResult = await pegaContatos({
      vendedorId:
        tokenResult.data.ID_USUARIO == 11 ? null : tokenResult.data.ID_USUARIO,
    });
    if (!contatosResult.success)
      return event.reply("envia-mensagem-response", contatosResult);

    // Verifica último uso da key
    const ultimoUsoKey = await pegaUltimoUsoKey(tokenResult.data.ID_USUARIO);
    if (!ultimoUsoKey.success)
      return event.reply("envia-mensagem-response", ultimoUsoKey);

    let agora;
    try {
      const responseTime = await fetch(
        "https://worldtimeapi.org/api/timezone/Etc/UTC",
      );
      const data = await responseTime.json();
      agora = new Date(data.utc_datetime);
    } catch (e) {
      agora = new Date();
    }

    // Verifica se passou pelo menos 5 minutos desde o último uso
    const diffMs = agora - new Date(ultimoUsoKey.data);
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 5 && tokenResult.data.ID_FUNCAO_USUARIO !== 1) {
      return event.reply("envia-mensagem-response", {
        success: false,
        error: `Aguarde mais ${
          5 - diffMinutes
        } minuto(s) para enviar novas mensagens.`,
      });
    }

    const keysResult = await pegaKeys({
      vendedorId: tokenResult.data.ID_USUARIO,
    });
    if (!keysResult.success)
      return event.reply("envia-mensagem-response", keysResult);

    const total =
      contatosResult.data.length * ((args.imagens?.length || 0) + 1);
    let progresso = 0;
    let mensagensEnviadas = 0;
    let mensagensNaoEnviadas = 0;

    for (const contato of contatosResult.data) {
      const mensagemArgs = {
        mensagem: args.mensagem.replace(/\$nome/g, contato.CONTATO_NOME),
        imagens: args.imagens,
        contatoNumero: contato.CONTATO_NUMERO,
        key: keysResult.data[0].KEY_VALUE,
        session: keysResult.data[0].SESSION,
      };
      // Envia imagens uma a uma, progresso o progresso
      if (args.imagens && args.imagens.length > 0) {
        for (const img of args.imagens) {
          const enviaImagemResult = await enviaImagens({
            ...mensagemArgs,
            imagens: [img],
          });
          if (enviaImagemResult.success) {
            mensagensEnviadas++;
          } else {
            mensagensNaoEnviadas++;
          }
          progresso++;
          event.sender.send("envia-mensagem-progresso", { progresso, total });
        }
      }
      // Envia mensagem de texto
      const enviaMensagemResult = await enviaMensagem(mensagemArgs);
      if (enviaMensagemResult.success) {
        mensagensEnviadas++;
      } else {
        mensagensNaoEnviadas++;
      }
      progresso++;
      event.sender.send("envia-mensagem-progresso", { progresso, total });
    }

    await atualizaUltimoUsoKey({
      data: agora,
      vendedorId: tokenResult.data.ID_USUARIO,
    });

    event.reply("envia-mensagem-response", {
      success: true,
      data: "Mensagens enviadas com sucesso.",
    });

    const dashboardWppArgs = {
      mensagem: args.mensagem,
      mensagensEnviadas,
      mensagensNaoEnviadas,
      taxaAcerto: Math.round(
        (mensagensEnviadas / (mensagensEnviadas + mensagensNaoEnviadas)) * 100,
      ),
      vendedorId: tokenResult.data.ID_USUARIO,
    };
    await salvaInfos(dashboardWppArgs);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    event.reply("envia-mensagem-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("search-contatos", async (event, filters) => {
  try {
    const tokenResult = await verificaToken(filters.token);
    if (!tokenResult.success)
      event.reply("search-contatos-response", tokenResult);

    const vendedorId = filters.vendedorId
      ? filters.vendedorId
      : tokenResult.data.ID_USUARIO == 1
        ? null
        : tokenResult.data.ID_USUARIO;

    const contatosResult = await pegaContatos({
      ...filters,
      vendedorId: vendedorId,
    });

    event.reply("search-contatos-response", contatosResult);
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    event.reply("search-contatos-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("adiciona-contato", async (event, args) => {
  try {
    const tokenResult = await verificaToken(args.token);
    if (!tokenResult.success)
      event.reply("adiciona-contato-response", tokenResult);
    const contatosResult = await pegaContatos({
      vendedorId: tokenResult.data.ID_USUARIO,
    });
    if (!contatosResult.success)
      event.reply("adiciona-contato-response", contatosResult);

    const adicionaResult = await adicionaContato({
      nome: args.nome,
      numero: args.numero,
      cnpj: args.cnpj,
      vendedorId: tokenResult.data.ID_USUARIO,
    });

    event.reply("adiciona-contato-response", adicionaResult);
  } catch (error) {
    console.error("Erro ao adicionar contato:", error);
    event.reply("adiciona-contato-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("pega-infos-dashboard-wpp", async (event, args) => {
  try {
    const tokenResult = await verificaToken(args.token);
    if (!tokenResult.success)
      event.reply("pega-infos-dashboard-wpp-response", tokenResult);
    if (tokenResult.data.ID_FUNCAO_USUARIO != 1)
      return event.reply("pega-infos-dashboard-wpp-response", {
        success: false,
        error: "Acesso negado.",
      });
    const infosResult = await pegaInfos();
    event.reply("pega-infos-dashboard-wpp-response", infosResult);
  } catch (error) {
    console.error("Erro ao pegar infos do dashboard WPP:", error);
    event.reply("pega-infos-dashboard-wpp-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});

ipcMain.on("edita-contato", async (event, contato) => {
  try {
    const tokenResult = await verificaToken(contato.token);
    if (!tokenResult.success)
      event.reply("edita-contato-response", tokenResult);

    if (
      tokenResult.data.vendedorId !== contato.vendedorId &&
      tokenResult.data.ID_FUNCAO_USUARIO != 1
    ) {
      return event.reply("edita-contato-response", {
        success: false,
        error: "Acesso negado.",
      });
    }

    const editaResult = await editaContato(contato);
    event.reply("edita-contato-response", editaResult);
  } catch (error) {
    console.error("Erro ao editar contato:", error);
    event.reply("edita-contato-response", {
      success: false,
      error: error.message || "Erro desconhecido",
    });
  }
});
