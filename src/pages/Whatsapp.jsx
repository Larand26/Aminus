import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";
import Content from "../components/Content";
import Toast from "../components/Toast";

import ClientesWpp from "../components/whatsapp/ClientesWpp";
import Dashboard from "../components/whatsapp/DashboardWpp";
import MensagensWpp from "../components/whatsapp/MensagensWpp";

import enviaMensagem from "../utils/whatsapp/enviaMensagem";
import searchContatos from "../utils/search/searchContatos";
import adicionaContato from "../utils/whatsapp/adicionaContato";

import vendedoresJson from "../assets/json/vendedores.json";
import opcoesContatosWhatsapp from "../assets/json/opcoes/opcoesContatosWhatsapp.json";

const Whatsapp = () => {
  //token
  const token = localStorage.getItem("token");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Estados dos inputs
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Dados
  const [contatos, setContatos] = useState([]);

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
      onClick: () => setPaginaAtiva("dashboard"),
    },
    {
      key: "mensagens",
      icon: "fa-brands fa-whatsapp",
      onClick: () => setPaginaAtiva("mensagens"),
    },
  ];

  // Págia ativa
  const [paginaAtiva, setPaginaAtiva] = useState("clientes");

  // Pesquisa
  const handleSearch = async () => {
    const filtros = {
      numero,
      nome: cliente,
      vendedor,
      token,
    };
    const resultados = await searchContatos(filtros);
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
  const [timer, setTimer] = useState("05:00");
  const [imagens, setImagens] = useState([]);

  // Envia a mensagem
  const handleEnviarMensagem = async () => {
    if (imagens.length === 0 && mensagemEnviar.trim() === "") return;

    const args = {
      token,
      mensagem: mensagemEnviar,
      imagens,
    };
    await enviaMensagem(args);
  };

  // Adiciona um cliente novo
  const [novoCliente, setNovoCliente] = useState({});
  const handleAdicionarCliente = async () => {
    const args = {
      ...novoCliente,
      token,
    };
    const adicionaResult = await adicionaContato(args);
    if (!adicionaResult?.success) {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao adicionar cliente.",
        type: "falha",
      });
      return;
    }
    setToastInfo({
      key: Date.now(),
      message: "Cliente adicionado com sucesso!",
      type: "sucesso",
    });

    console.log("Cliente adicionado:", adicionaResult);
    setNovoCliente({});
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

      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel label="Número" value={numero} onChange={setNumero} />
          <InputLabel label="Cliente" value={cliente} onChange={setCliente} />
          <SelectLabel
            label="Vendedor"
            options={vendedoresJson}
            value={vendedor}
            onChange={setVendedor}
          />
        </BarraLateral>
        <Content titulo="WhatsApp" pages={pages}>
          {paginaAtiva === "clientes" && (
            <ClientesWpp
              dados={contatos}
              opcoes={opcoesContatosWhatsapp}
              onClick={handleAdicionarCliente}
              novoCliente={novoCliente}
              setNovoCliente={setNovoCliente}
            />
          )}
          {paginaAtiva === "dashboard" && <Dashboard />}
          {paginaAtiva === "mensagens" && (
            <MensagensWpp
              timer={timer}
              mensagemEnviar={mensagemEnviar}
              imagens={imagens}
              setImagens={setImagens}
              setMensagemEnviar={setMensagemEnviar}
              onEnviar={() => handleEnviarMensagem()}
            />
          )}
        </Content>
      </div>
    </>
  );
};
export default Whatsapp;
