import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";
import Content from "../components/Content";

import vendedoresJson from "../assets/json/vendedores.json";

const Whatsapp = () => {
  // Estados dos inputs
  const [numero, setNumero] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [vendedor, setVendedor] = useState("");

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
  const handleSearch = () => {};

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel label="Número" value={numero} onChange={setNumero} />
          <InputLabel label="Cliente" value={mensagem} onChange={setMensagem} />
          <SelectLabel
            label="Vendedor"
            options={vendedoresJson}
            value={vendedor}
            onChange={setVendedor}
          />
        </BarraLateral>
        <Content titulo="WhatsApp" pages={pages}>
          {paginaAtiva === "clientes" && <div>Conteúdo da página Clientes</div>}
          {paginaAtiva === "dashboard" && (
            <div>Conteúdo da página Dashboard</div>
          )}
          {paginaAtiva === "mensagens" && (
            <div>Conteúdo da página Mensagens</div>
          )}
        </Content>
      </div>
    </>
  );
};
export default Whatsapp;
