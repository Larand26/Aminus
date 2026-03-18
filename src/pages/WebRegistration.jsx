import { useState, useEffect } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/SideBar";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/table/Table";
import SelectLabel from "../components/SelectLabel";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import ButtonTypeGender from "../components/buttons/ButtonTypeGender";
import InputButton from "../components/InputButton";
import Toast from "../components/Toast";

import searchWebRegistration from "../utils/search/searchCadastroWeb";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import searchColors from "../utils/search/searchCores";
import updateSelectedItem from "../utils/cadastroweb/atualizaItemSelecionado";
import updateName from "../utils/cadastroweb/atualizaNome";
import createNewColor from "../utils/cadastroweb/criaCorNova";
import registerProducts from "../utils/cadastroweb/cadastraProdutos";

import opcoesCadastroWeb from "../assets/json/opcoes/opcoesCadastroWeb.json";
import coresTeste from "../assets/json/coresTeste.json";
import opcoesGrade from "../assets/json/opcoes/opcoesGrade.json";
import generos from "../assets/json/generos.json";
import tipos from "../assets/json/tipos.json";

import "../styles/cadastro-web.css";
import "../styles/inputs/input-styled.css";

import uknown from "../assets/img/unknown.jpg";

const WebRegistration = () => {
  // Input states
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");

  // Products
  const [produtos, setProdutos] = useState([]);

  const handleSearch = async () => {
    const filtros = {
      codFabricante: codFabricante,
      codInterno: codInterno,
    };
    console.log("Searching with filters:", filtros);
    const response = await searchWebRegistration(filtros);
    console.log("Search results:", response);
    if (response.success) {
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No products found with the selected filters.",
          type: "aviso",
        });

        handleItemSelecionado(null);
      }

      setProdutos(response.data);
      handleItemSelecionado(response.data[0]);
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching colors.",
        type: "falha",
      });
      return;
    }
  };

  // Handles Enter key submit
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Table states
  const [cores, setCores] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]); // Estado para itens selecionados

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Colors
  useEffect(() => {
    const coresIniciais = produtos.map((produto) => ({
      value: produto.COD_COR_ECOMMERCE,
      label: produto.COR_DESCRICAO,
    }));
    setCoresSelecionadas(coresIniciais);
    const coresUnicas = coresIniciais.filter(
      (cor, index, self) =>
        index === self.findIndex((c) => c.value === cor.value),
    );
    setCores(coresUnicas);
  }, [produtos]);

  const handleChangeCor = (codInterno, newValue) => {
    const selectedCor = cores.find((cor) => cor.value === newValue);
    const newLabel = selectedCor ? selectedCor.label : null;

    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => {
        if (p.COD_INTERNO === codInterno) {
          return {
            ...p,
            COD_COR_ECOMMERCE: newValue,
            COR_DESCRICAO: newLabel,
          };
        }
        return p;
      }),
    );
  };

  const handleSearchCores = async (term) => {
    const response = await searchColors(term);

    if (!response.success) {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching colors.",
        type: "falha",
      });
      return;
    }

    const novasCores = response.data.map((cor) => ({
      value: cor.value,
      label: cor.label,
    }));

    const coresCombinadas = [...coresSelecionadas, ...novasCores];
    const coresUnicas = coresCombinadas.filter(
      (cor, index, self) =>
        index === self.findIndex((c) => c.value === cor.value),
    );

    setCores(coresUnicas);
  };

  // Ecommerce active flags
  const handleAtivoEcommerceChange = (index) => {
    setProdutos((prevProdutos) => {
      const novosProdutos = [...prevProdutos];
      const produto = novosProdutos[index];
      // Toggle both ecommerce flags together
      const novoEstado = !(
        produto.ATIVO_ECOMMERCE && produto.INTEGRACAO_ECOMMERCE
      );
      novosProdutos[index] = {
        ...produto,
        ATIVO_ECOMMERCE: novoEstado,
        INTEGRACAO_ECOMMERCE: novoEstado,
      };
      return novosProdutos;
    });
  };

  const handleAtivoEcommerceChangeAll = (checked) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) => ({
        ...produto,
        ATIVO_ECOMMERCE: checked,
        INTEGRACAO_ECOMMERCE: checked,
      })),
    );
  };

  // Selected item
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const handleItemSelecionado = async (item) => {
    if (item?.COD_INTERNO === itemSelecionado?.COD_INTERNO) return;

    const { itemAtualizado, cor } = await updateSelectedItem(item);
    console.log("Updated selected item in component:", itemAtualizado);
    setItemSelecionado(itemAtualizado);
    setCorNova(cor);
  };

  // Type and gender
  const handleTipoGeneroClick = (field, value) => {
    let valor = value;
    switch (field) {
      case "tipo":
      case "genero":
        break;
      case "colecao":
        itemSelecionado?.colecao == "PROMO"
          ? (valor = "NORMAL")
          : (valor = "PROMO");
        break;
      default:
        console.error("Invalid field for type/gender:", field);
        return;
    }
    setItemSelecionado((prevItem) => ({
      ...prevItem,
      [field]: valor,
    }));
  };

  // Name and parent
  const [nome, setNome] = useState("");
  const [pai, setPai] = useState("");

  useEffect(() => {
    const novoNome = updateName(itemSelecionado);
    setNome(novoNome);
    const novoPai = `${itemSelecionado?.codFabricante || ""}-${
      itemSelecionado?.colecao == "PROMO" ? "PROMO" : "GREN"
    }-PAI`;
    setPai(novoPai);
  }, [itemSelecionado]);

  // New color
  const [corNova, setCorNova] = useState("");

  const handleCorNova = async () => {
    if (!corNova) return;

    const response = await createNewColor(corNova.toUpperCase());
    if (response.success) {
      setToastInfo({
        key: Date.now(),
        message: "Color created successfully!",
        type: "sucesso",
      });
    } else {
      setToastInfo({
        key: Date.now(),
        message: response.message || "Failed to create color.",
        type: "falha",
      });
    }
  };

  // Register products
  const handleCadastrarProduto = async () => {
    if (itensSelecionados.length === 0) return;
    const response = await registerProducts(
      itensSelecionados,
      produtos,
      nome,
      pai,
    );
    if (response.success) {
      setToastInfo({
        key: Date.now(),
        message: "Products registered successfully!",
        type: "sucesso",
      });
    } else {
      setToastInfo({
        key: Date.now(),
        message: response.error || "Failed to register products.",
        type: "falha",
      });
    }
  };

  // Options
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesCadastroWeb");
    return atualizaOpcoes(opcoesCadastroWeb, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesCadastroWeb", JSON.stringify(updatedOptions));
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
          <InputLabel
            label="Manufacturer Code"
            value={codFabricante}
            onChange={setCodFabricante}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Internal Code"
            value={codInterno}
            onChange={setCodInterno}
            onKeyDown={handleKeyDown}
          />
        </SideBar>
        <div className="content container-cadastro-web">
          <div className="container-dados">
            <div className="container tipo-genero">
              <div className="container-tipo">
                <div className="tipos">
                  {generos.map((gen) => (
                    <BotaoTipoGen
                      key={gen.icon}
                      icon={gen.icon}
                      className={`${
                        itemSelecionado?.[gen.field] === gen.value
                          ? "selecionado"
                          : ""
                      } ${gen.value === "PROMO" ? "promo" : ""}`}
                      onClick={() =>
                        handleTipoGeneroClick(gen.field, gen.value)
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="container-tipo">
                <div className="tipos">
                  {tipos.map((tipo) => (
                    <BotaoTipoGen
                      key={tipo.icon}
                      icon={tipo.icon}
                      className={
                        itemSelecionado?.[tipo.field] === tipo.value
                          ? "selecionado"
                          : ""
                      }
                      onClick={() =>
                        handleTipoGeneroClick(tipo.field, tipo.value)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="container display">
              <div className="nome-pai">
                <div className="nome-produto">
                  <h3>Name:</h3>
                  <p>{nome}</p>
                </div>
                <hr />
                <div className="pai">
                  <h3>Parent:</h3>
                  <p>{pai}</p>
                </div>
                <div className="container-btn-cadastro">
                  <button
                    className="btn-cadastrar"
                    onClick={handleCadastrarProduto}
                  >
                    Register
                  </button>
                </div>
              </div>
              <div className="foto">
                <img src={itemSelecionado?.foto || uknown} alt="" />
              </div>
            </div>
            <div className="container grade-corNova">
              <div className="inputs">
                <InputButton
                  placeholder="Add new color"
                  icon="fa fa-plus"
                  value={corNova}
                  onChange={(e) => setCorNova(e.target.value)}
                  onBlur={() => setCorNova(corNova.toUpperCase())}
                  onClick={handleCorNova}
                />
                <input
                  type="text"
                  className="input-styled"
                  value={nome}
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                />
              </div>
              <div className="tabela-grade">
                <Tabela
                  dados={itemSelecionado?.grade}
                  isLoading={false}
                ></Tabela>
              </div>
            </div>
          </div>
          <div className="container-tabela">
            <Tabela
              dados={produtos}
              isLoading={false}
              hover
              select="checkbox"
              chave="COD_INTERNO" // Unique property used to identify each item
              onSelectionChange={setItensSelecionados} // Receives selected items
              itemSelecionado={itemSelecionado}
              search={
                opcoes.find((opcao) => opcao.id === "search").checked || false
              }
            ></Tabela>
          </div>
        </div>
      </div>
    </>
  );
};
export default WebRegistration;
