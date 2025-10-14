import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";

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

  //Opções de configuração
  const opcoes = [
    { id: "exibir-inativos", label: "Exibir Inativos", checked: true },
    { id: "COD_INTERNO", label: "Cod Interno", checked: true },
    { id: "COD_FABRICANTE", label: "Cod Fabricante", checked: true },
    { id: "DESCRICAO", label: "Descrição", checked: true },
    { id: "COD_BARRAS", label: "Cod Barras", checked: true },
    { id: "QUANT_TOTAL", label: "Quantidade Total", checked: true },
    { id: "ESTOQUE_DISPONIVEL", label: "Quantidade Disponível", checked: true },
    { id: "ENDERECO", label: "Endereço", checked: true },
    { id: "PRECO", label: "Preço", checked: true },
    { id: "ALTURA", label: "Altura", checked: true },
    { id: "LARGURA", label: "Largura", checked: true },
    { id: "COMPRIMENTO", label: "Comprimento", checked: true },
    { id: "DATA_ALTERACAO", label: "Data Alteração", checked: true },
  ];

  return (
    <>
      <Configuracoes>
        {opcoes.map((opcao) => (
          <Opcao
            key={opcao.id}
            id={opcao.id}
            label={opcao.label}
            checked={opcao.checked}
          />
        ))}
      </Configuracoes>
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
            <Coluna titulo="Cod Interno" campo="COD_INTERNO" />
            <Coluna titulo="Cod Fabricante" campo="COD_FABRICANTE" />
            <Coluna titulo="Descricao" campo="DESCRICAO" />
            <Coluna titulo="Cod Barras" campo="COD_BARRAS" />
            <Coluna titulo="Quantidade Total" campo="QUANT_TOTAL" />
            <Coluna titulo="Quantidade Disponível" campo="ESTOQUE_DISPONIVEL" />
            <Coluna
              titulo="Endereço"
              body={(row) => `${row.RUA || " "} - ${row.FILEIRA || " "}`}
            />
            <Coluna
              titulo="Preço"
              body={(row) => `R$ ${row.PRECO.toFixed(2).replace(".", ",")}`}
            />
            <Coluna titulo="Altura" campo="ALTURA" />
            <Coluna titulo="Largura" campo="LARGURA" />
            <Coluna titulo="Comprimento" campo="COMPRIMENTO" />
            <Coluna
              titulo="Data Alteração"
              body={(row) =>
                row.DATA_ALTERACAO
                  ? new Date(row.DATA_ALTERACAO).toLocaleDateString("pt-BR")
                  : " "
              }
            />
          </Tabela>
        </div>
      </div>
    </>
  );
};

export default Produtos;
