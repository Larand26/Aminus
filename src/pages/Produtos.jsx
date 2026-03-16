import { useState } from "react";

import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import InputLabel from "../components/InputLabel";
import InputNumeroLabel from "../components/InputNumeroLabel";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import Toast from "../components/Toast";
import Content from "../components/Content";
import InputText from "../components/inputs/InputText.jsx";
import Table from "../components/tabela/Table.jsx";

import ProductUtil from "../utils/Product.js";

import opcoesProdutos from "../assets/json/opcoes/opcoesProdutos.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Produtos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState(null);
  const [codInterno, setCodInterno] = useState(null);
  const [codBarras, setCodBarras] = useState(null);
  const [nome, setNome] = useState(null);
  const [quantidade, setQuantidade] = useState(null);

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
    const response = await ProductUtil.getProducts({
      token: "token",
      filters: {
        idFabric: codFabricante,
        idProduto: codInterno,
        barcode: codBarras,
        description: nome,
        quantity: quantidade,
      },
    });
    setIsLoading(false);
    console.log(response);

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
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
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
        <SideBar onSearch={handleSearch}>
          <InputText
            label="Cod Fabricante"
            value={codFabricante}
            onChange={setCodFabricante}
            onKeyDown={handleKeyDown}
          />
          <InputText
            label="Cod Interno"
            value={codInterno}
            onChange={setCodInterno}
            onKeyDown={handleKeyDown}
          />
          <InputText
            label="Cod Barras"
            value={codBarras}
            onChange={setCodBarras}
            onKeyDown={handleKeyDown}
          />
          <InputText
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
        </SideBar>
        <Content titulo="Produtos">
          <Table
            options={opcoes.filter((opcao) => opcao.checked)}
            datas={produtos}
            loading={isLoading}
          ></Table>
        </Content>
      </div>
    </>
  );
};

export default Produtos;
