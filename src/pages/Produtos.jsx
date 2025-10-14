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

  //Opções
  const [opcoes, setOpcoes] = useState([
    { id: "COD_INTERNO", label: "Cod Interno", checked: true },
    { id: "COD_FABRICANTE", label: "Cod Fabricante", checked: true },
    { id: "COD_BARRAS", label: "Cod Barras", checked: true },
    { id: "NOME", label: "Nome", checked: true },
    { id: "DESCRICAO", label: "Descrição", checked: true },
    { id: "QUANT_TOTAL", label: "Quantidade Total", checked: true },
    { id: "ESTOQUE_DISPONIVEL", label: "Estoque Disponível", checked: true },
    { id: "PRECO", label: "Preço", checked: true },
    { id: "ENDERECO", label: "Endereço", checked: true },
    { id: "ALTURA", label: "Altura", checked: true },
    { id: "LARGURA", label: "Largura", checked: true },
    { id: "COMPRIMENTO", label: "Comprimento", checked: true },
    { id: "DATA_ALTERACAO", label: "Data Alteração", checked: true },
    { id: "PESO_BR", label: "Peso Bruto", checked: true },
    { id: "PESO_LIQ", label: "Peso Líquido", checked: true },
  ]);

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
  };

  return (
    <>
      <Configuracoes>
        {opcoes.map((opcao) => (
          <Opcao
            key={opcao.id}
            id={opcao.id}
            label={opcao.label}
            checked={opcao.checked}
            onClick={handleOptionClick}
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
            {opcoes.find((o) => o.id === "COD_INTERNO")?.checked ? (
              <Coluna titulo="Cod Interno" campo="COD_INTERNO" />
            ) : null}
            {opcoes.find((o) => o.id === "COD_FABRICANTE")?.checked ? (
              <Coluna titulo="Cod Fabricante" campo="COD_FABRICANTE" />
            ) : null}
            {opcoes.find((o) => o.id === "DESCRICAO")?.checked ? (
              <Coluna titulo="Descricao" campo="DESCRICAO" />
            ) : null}
            {opcoes.find((o) => o.id === "COD_BARRAS")?.checked ? (
              <Coluna titulo="Cod Barras" campo="COD_BARRAS" />
            ) : null}
            {opcoes.find((o) => o.id === "QUANT_TOTAL")?.checked ? (
              <Coluna titulo="Quantidade Total" campo="QUANT_TOTAL" />
            ) : null}
            {opcoes.find((o) => o.id === "ESTOQUE_DISPONIVEL")?.checked ? (
              <Coluna
                titulo="Quantidade Disponível"
                campo="ESTOQUE_DISPONIVEL"
              />
            ) : null}
            {opcoes.find((o) => o.id === "ENDERECO")?.checked ? (
              <Coluna
                titulo="Endereço"
                body={(row) => `${row.RUA || " "} - ${row.FILEIRA || " "}`}
              />
            ) : null}
            {opcoes.find((o) => o.id === "PRECO")?.checked ? (
              <Coluna
                titulo="Preço"
                body={(row) => `R$ ${row.PRECO.toFixed(2).replace(".", ",")}`}
              />
            ) : null}
            {opcoes.find((o) => o.id === "ALTURA")?.checked ? (
              <Coluna titulo="Altura" campo="ALTURA" />
            ) : null}
            {opcoes.find((o) => o.id === "LARGURA")?.checked ? (
              <Coluna titulo="Largura" campo="LARGURA" />
            ) : null}
            {opcoes.find((o) => o.id === "COMPRIMENTO")?.checked ? (
              <Coluna titulo="Comprimento" campo="COMPRIMENTO" />
            ) : null}
            {opcoes.find((o) => o.id === "PESO_BR")?.checked ? (
              <Coluna titulo="Peso Bruto" campo="PESO_BR" />
            ) : null}
            {opcoes.find((o) => o.id === "PESO_LIQ")?.checked ? (
              <Coluna titulo="Peso Líquido" campo="PESO_LIQ" />
            ) : null}
            {opcoes.find((o) => o.id === "DATA_ALTERACAO")?.checked ? (
              <Coluna
                titulo="Data Alteração"
                body={(row) =>
                  row.DATA_ALTERACAO
                    ? new Date(row.DATA_ALTERACAO).toLocaleDateString("pt-BR")
                    : " "
                }
              />
            ) : null}
          </Tabela>
        </div>
      </div>
    </>
  );
};

export default Produtos;
