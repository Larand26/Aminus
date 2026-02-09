import { useEffect, useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";
import Content from "../components/Content";
import Toast from "../components/Toast";
import PopUp from "../components/PopUp";

import ClientesWpp from "../components/whatsapp/ClientesWpp";
import Dashboard from "../components/whatsapp/DashboardWpp";
import MensagensWpp from "../components/whatsapp/MensagensWpp";

import enviaMensagem from "../utils/whatsapp/enviaMensagem";
import searchContatos from "../utils/search/searchContatos";
import adicionaContato from "../utils/whatsapp/adicionaContato";
import onEnviaMensagemProgresso from "../utils/whatsapp/progresso";
import pegaInfosDashboardWpp from "../utils/whatsapp/pegaInfosDashboardWpp";
import editaContato from "../utils/whatsapp/editaContato";
import geraQrcode from "../utils/whatsapp/geraQrcode";

import vendedoresJson from "../assets/json/vendedoresAminus.json";
import opcoesContatosWhatsapp from "../assets/json/opcoes/opcoesContatosWhatsapp.json";
import opcoesDashboardWpp from "../assets/json/opcoes/opcoesDashboardWpp.json";
import opcoesMensagens from "../assets/json/opcoes/opcoesMensagens.json";

const Whatsapp = () => {
  //token
  const token = localStorage.getItem("token");

  // Função do usuário
  const idFuncao = localStorage.getItem("ID_FUNCAO_USUARIO");

  // Loading
  const [loading, setLoading] = useState(false);

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Estados dos inputs
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Dados
  const [contatos, setContatos] = useState([]);

  // PopUp
  const [popUpQrCodeOpen, setPopUpQrCodeOpen] = useState(false);

  // QR Code
  const [qrcodeSrc, setQrcodeSrc] = useState("");

  // Páginas para o Content
  const pages = [
    {
      key: "clientes",
      icon: "fa fa-phone",
      onClick: () => setPaginaAtiva("clientes"),
    },
    {
      key: "dashboard",
      icon: "fa-solid fa-chart-bar",
      onClick: () => {
        setPaginaAtiva("dashboard");
        handlePegaInfosDashboardWpp();
      },
    },
    {
      key: "mensagens",
      icon: "fa-brands fa-whatsapp",
      onClick: () => setPaginaAtiva("mensagens"),
    },
    {
      key: "qrcode",
      icon: "fa-solid fa-qrcode",
      onClick: async () => {
        setPopUpQrCodeOpen(true);
        const qrCodeResult = await geraQrcode(token);
        if (!qrCodeResult?.success) {
          setToastInfo({
            key: Date.now(),
            message: qrCodeResult?.error || "Erro ao gerar QR Code.",
            type: "falha",
          });
          return;
        }
        setQrcodeSrc(qrCodeResult.data.qrcode);
      },
    },
  ];

  // Págia ativa
  const [paginaAtiva, setPaginaAtiva] = useState("clientes");

  // Pesquisa
  const handleSearch = async () => {
    setContatos([]);
    setLoading(true);
    const filtros = {
      numero,
      nome: cliente,
      vendedorId: vendedor,
      token,
    };
    const resultados = await searchContatos(filtros);
    setLoading(false);
    if (!resultados?.success) {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao buscar contatos.",
        type: "falha",
      });
      return;
    }
    if (resultados.data.length === 0) {
      setToastInfo({
        key: Date.now(),
        message: "Nenhum contato encontrado.",
        type: "aviso",
      });
      return;
    }
    setContatos(resultados.data);
  };

  // Estados de mensagens
  const [mensagemEnviar, setMensagemEnviar] = useState("");
  const [timerSegundos, setTimerSegundos] = useState(300); // Começa em 5 minutos (300 segundos)
  const [imagens, setImagens] = useState([]);

  // Números selecionados para enviar mensagens
  const [contatosSelecionados, setContatosSelecionados] = useState([]);

  // Timer regressivo de 5 minutos
  useEffect(() => {
    const ultimaMensagemWpp = localStorage.getItem("ultimaMensagemWpp");
    let timerInterval = null;

    const atualizarTimer = () => {
      if (!ultimaMensagemWpp) {
        setTimerSegundos(300);
        return;
      }
      const ultimaMensagemDate = new Date(ultimaMensagemWpp);
      const agora = new Date();
      const diferencaSegundos = Math.floor((agora - ultimaMensagemDate) / 1000);
      const restante = 300 - diferencaSegundos;
      setTimerSegundos(restante > 0 ? restante : 0);
    };

    atualizarTimer(); // Atualiza imediatamente ao montar

    timerInterval = setInterval(() => {
      atualizarTimer();
    }, 1000);

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [localStorage.getItem("ultimaMensagemWpp")]);

  // Envia a mensagem
  const handleEnviarMensagem = async () => {
    if (imagens.length === 0 && mensagemEnviar.trim() === "") return;
    setEnviando(true);
    setProgresso({ progresso: 0, total: 0 });

    const args = {
      token,
      mensagem: mensagemEnviar,
      imagens,
      contatos: contatosSelecionados,
    };
    const result = await enviaMensagem(args);
    setEnviando(false);
    console.log(result);
    if (!result?.success) {
      setToastInfo({
        key: Date.now(),
        message: result?.error || "Erro ao enviar mensagens.",
        type: "falha",
      });
      setProgresso({ progresso: 1, total: 1 });
    } else {
      localStorage.setItem("ultimaMensagemWpp", new Date().toISOString());
      setToastInfo({
        key: Date.now(),
        message: "Mensagens enviadas com sucesso!",
        type: "sucesso",
      });
    }
  };

  // Adiciona um cliente novo
  const [novoCliente, setNovoCliente] = useState({});
  const handleAdicionarCliente = async () => {
    setLoading(true);
    const args = {
      ...novoCliente,
      token,
    };
    const adicionaResult = await adicionaContato(args);
    setLoading(false);
    if (!adicionaResult?.success) {
      setToastInfo({
        key: Date.now(),
        message: adicionaResult?.error || "Erro ao adicionar cliente.",
        type: "falha",
      });
      return;
    }
    setToastInfo({
      key: Date.now(),
      message: "Cliente adicionado com sucesso!",
      type: "sucesso",
    });

    setNovoCliente({});
    handleSearch();
  };

  // Progresso
  const [progresso, setProgresso] = useState({ progresso: 1, total: 1 });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    onEnviaMensagemProgresso(setProgresso);
  }, []);

  // Para exibir o timer no formato mm:ss
  const formatTimer = (segundos) => {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Dashboard WPP - Pega infos
  const [infosDashboardWpp, setInfosDashboardWpp] = useState([]);

  const handlePegaInfosDashboardWpp = async () => {
    const args = { token };
    const infosResult = await pegaInfosDashboardWpp(args);
    console.log(infosResult);
    if (!infosResult?.success) {
      setToastInfo({
        key: Date.now(),
        message: infosResult?.error || "Erro ao carregar dashboard WPP.",
        type: "falha",
      });
      return;
    }
    setInfosDashboardWpp(infosResult.data);
  };

  // Handle Edit Cliente
  const handleEditCliente = async (cliente) => {
    // Lógica para editar o cliente com o ID fornecido
    console.log("Editar cliente com ID:", cliente);
    // Transforma dados em inputs editáveis ou abre um modal de edição
    const response = await editaContato({ ...cliente, token });

    if (!response?.success) {
      setToastInfo({
        key: Date.now(),
        message: response?.error || "Erro ao editar cliente.",
        type: "falha",
      });
      return;
    }
    setToastInfo({
      key: Date.now(),
      message: "Cliente editado com sucesso!",
      type: "sucesso",
    });
    handleSearch();
  };

  return (
    <>
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}

      <PopUp
        id="popup-qrcode"
        width="400px"
        height="400px"
        title="QR Code"
        open={popUpQrCodeOpen}
        setOpen={setPopUpQrCodeOpen}
      >
        <h1>QR Code</h1>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {qrcodeSrc ? (
            <img src={qrcodeSrc} alt="QR Code WhatsApp" />
          ) : (
            <p>Carregando QR Code...</p>
          )}
        </div>
      </PopUp>

      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel label="Número" value={numero} onChange={setNumero} />
          <InputLabel label="Cliente" value={cliente} onChange={setCliente} />
          {idFuncao != 2 && (
            <SelectLabel
              label="Vendedor"
              options={vendedoresJson}
              value={vendedor}
              onChange={setVendedor}
            />
          )}
        </BarraLateral>
        <Content
          titulo="WhatsApp"
          pages={pages}
          timer={
            <>
              {formatTimer(timerSegundos)}
              <i className="fa fa-clock"></i>
            </>
          }
        >
          {paginaAtiva === "clientes" && (
            <ClientesWpp
              dados={contatos}
              opcoes={opcoesContatosWhatsapp}
              onClick={handleAdicionarCliente}
              novoCliente={novoCliente}
              setNovoCliente={setNovoCliente}
              loading={loading}
              onEdit={handleEditCliente}
            />
          )}
          {paginaAtiva === "dashboard" && (
            <Dashboard opcoes={opcoesDashboardWpp} dados={infosDashboardWpp} />
          )}
          {paginaAtiva === "mensagens" && (
            <MensagensWpp
              timer={formatTimer(timerSegundos)}
              mensagemEnviar={mensagemEnviar}
              imagens={imagens}
              setImagens={setImagens}
              setMensagemEnviar={setMensagemEnviar}
              onEnviar={() => handleEnviarMensagem()}
              progresso={progresso}
              enviando={enviando}
              dados={contatos}
              opcoes={opcoesMensagens}
              onSelectionChange={setContatosSelecionados}
            />
          )}
        </Content>
      </div>
    </>
  );
};
export default Whatsapp;
