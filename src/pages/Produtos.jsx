import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import InputNumeroLabel from "../components/InputNumeroLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import Toast from "../components/Toast";
import Content from "../components/Content";

import searchProdutos from "../utils/search/searchProdutos";

import opcoesProdutos from "../assets/json/opcoes/opcoesProdutos.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Produtos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codBarras, setCodBarras] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Produtos
  const [produtos, setProdutos] = useState([]);

  // Função que executa a busca
  const handleSearch = async () => {
    setProdutos([]);
    setIsLoading(true);
    const response = await searchProdutos({
      codFabricante: codFabricante,
      codInterno: codInterno,
      codBarras: codBarras,
      nome: nome,
      quantidade: quantidade,
    });
    setIsLoading(false);

    if (response.success) {
      setProdutos(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "Nenhum produto encontrado com os filtros informados.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao buscar produtos.",
        type: "falha",
      });
    }
  };

  // Função para lidar com a tecla Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesProdutos");
    return atualizaOpcoes(opcoesProdutos, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesProdutos", JSON.stringify(updatedOptions));
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
            onChange={handleOptionClick}
          />
        ))}
      </Configuracoes>
      <NavBar />
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
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
          <InputNumeroLabel
            adicional={12}
            label="Quantidade"
            value={quantidade}
            onChange={setQuantidade}
            onKeyDown={handleKeyDown}
          />
        </BarraLateral>
        <Content titulo="Produtos">
          <Tabela
            dados={produtos}
            semDados="Nenhum produto encontrado"
            loading={isLoading}
            search={opcoes.find((opcao) => opcao.id === "search").checked}
          >
            {opcoes
              .filter((opcao) => opcao.checked)
              .map((opcao) => (
                <Coluna
                  key={opcao.id}
                  titulo={opcao.label}
                  campo={opcao.id}
                  format={opcao.format || ""}
                  dados={opcao.dados || []}
                />
              ))}
          </Tabela>
        </Content>
      </div>
    </>
  );
};

export default Produtos;
