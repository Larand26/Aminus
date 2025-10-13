import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";

import searchProdutos from "../utils/search/searchProdutos";

const Produtos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codBarras, setCodBarras] = useState("");
  const [nome, setNome] = useState("");

  // Produtos
  const [produtos, setProdutos] = useState([]);

  // Função que executa a busca
  const handleSearch = async () => {
    const resultados = await searchProdutos({
      codFabricante: codFabricante,
      codInterno: codInterno,
      codBarras: codBarras,
      nome: nome,
    });
    setProdutos(resultados.data);
    console.log(resultados);
  };

  // Função para lidar com a tecla Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel
            label="Cod Fabricante"
            value={codFabricante}
            onChange={setCodFabricante}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Cod Interno"
            value={codInterno}
            onChange={setCodInterno}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Cod Barras"
            value={codBarras}
            onChange={setCodBarras}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Nome"
            value={nome}
            onChange={setNome}
            onKeyDown={handleKeyDown}
          />
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Produtos</h1>
          </div>
          <Tabela dados={produtos} semDados="Nenhum produto encontrado">
            <Coluna titulo="Cod Interno" campo="ID_CODPRODUTO" />
            <Coluna titulo="Cod Fabricante" campo="PROD_CODFABRIC" />
            <Coluna titulo="Descricao" campo="PROD_DESCRCOMPLETA" />
            <Coluna titulo="Cod Barras" campo="PROD_CODBARRA" />
          </Tabela>
        </div>
      </div>
    </>
  );
};

export default Produtos;
