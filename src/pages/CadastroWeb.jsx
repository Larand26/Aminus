import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import SelectLabel from "../components/SelectLabel";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import BotaoTipoGen from "../components/BotaoTipoGen";
import InputButton from "../components/InputButton";

import searchCadastroWeb from "../utils/search/searchCadastroWeb";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import searchCores from "../utils/search/searchCores";
import atualizaItemSelecionado from "../utils/cadastroweb/atualizaItemSelecionado";
import atualizaNome from "../utils/cadastroweb/atualizaNome";
import criaCorNova from "../utils/cadastroweb/criaCorNova";
import cadastraProdutos from "../utils/cadastroweb/cadastraProdutos";

import opcoesCadastroWeb from "../assets/json/opcoes/opcoesCadastroWeb.json";
import coresTeste from "../assets/json/coresTeste.json";
import opcoesGrade from "../assets/json/opcoes/opcoesGrade.json";
import generos from "../assets/json/generos.json";
import tipos from "../assets/json/tipos.json";

import "../styles/cadastro-web.css";
import "../styles/inputs/input-styled.css";

const CadastroWeb = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");

  // Produtos
  const [produtos, setProdutos] = useState([]);

  const handleSearch = async () => {
    const filtros = {
      codFabricante: codFabricante,
      codInterno: codInterno,
    };
    console.log("Buscando com os filtros:", filtros);
    const resultados = await searchCadastroWeb(filtros);
    console.log("Resultados da busca:", resultados);
    if (resultados.success) {
      setProdutos(resultados.data);
      handleItemSelecionado(resultados.data[0]);
    }
  };

  // Estados da tabela
  const [cores, setCores] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);
  const [ativosEcommerce, setAtivosEcommerce] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]); // Estado para itens selecionados

  // Cores
  useEffect(() => {
    const coresIniciais = produtos.map((produto) => ({
      value: produto.COD_COR_ECOMMERCE,
      label: produto.COR_DESCRICAO,
    }));
    setCoresSelecionadas(coresIniciais);
    const coresUnicas = coresIniciais.filter(
      (cor, index, self) =>
        index === self.findIndex((c) => c.value === cor.value)
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
      })
    );
  };

  const handleSearchCores = async (term) => {
    const resultados = await searchCores(term);
    console.log(resultados);
    if (!resultados.success) return;
    const novasCores = resultados.data.map((cor) => ({
      value: cor.value,
      label: cor.label,
    }));

    const coresCombinadas = [...coresSelecionadas, ...novasCores];
    const coresUnicas = coresCombinadas.filter(
      (cor, index, self) =>
        index === self.findIndex((c) => c.value === cor.value)
    );

    setCores(coresUnicas);
  };

  // Ativos Ecommerce
  useEffect(() => {
    const ativos = produtos.map(
      (produto) =>
        produto.ATIVO_ECOMMERCE === true &&
        produto.INTEGRACAO_ECOMMERCE === true
    );
    setAtivosEcommerce(ativos);
  }, [produtos]);

  const handleAtivoEcommerceChange = (index) => {
    setAtivosEcommerce((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleAtivoEcommerceChangeAll = (checked) => {
    setAtivosEcommerce(produtos.map(() => checked));
  };

  // Item selecionado
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const handleItemSelecionado = async (item) => {
    if (item?.COD_INTERNO === itemSelecionado?.COD_INTERNO) return;

    const { itemAtualizado, cor } = await atualizaItemSelecionado(item);
    console.log("Item selecionado atualizado no componente:", itemAtualizado);
    setItemSelecionado(itemAtualizado);
    setCorNova(cor);
  };

  // Tipo e Gênero
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
        console.error("Campo inválido para Tipo/Gênero:", field);
        return;
    }
    setItemSelecionado((prevItem) => ({
      ...prevItem,
      [field]: valor,
    }));
  };

  // Nome e pai
  const [nome, setNome] = useState("");
  const [pai, setPai] = useState("");

  useEffect(() => {
    const novoNome = atualizaNome(itemSelecionado);
    setNome(novoNome);
    const novoPai = `${itemSelecionado?.codFabricante || ""}-${
      itemSelecionado?.colecao == "PROMO" ? "PROMO" : "GREN"
    }-PAI`;
    setPai(novoPai);
  }, [itemSelecionado]);

  // Cor nova
  const [corNova, setCorNova] = useState("");

  const handleCorNova = async () => {
    if (!corNova) return;

    const response = await criaCorNova(corNova);
    console.log(response);
  };

  // Cadastra os produtos
  const handleCadastrarProduto = async () => {
    if (itensSelecionados.length === 0) return;
    const response = await cadastraProdutos(
      itensSelecionados,
      nome,
      pai,
      ativosEcommerce
    );
    console.log(response);
  };

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesCadastroWeb");
    return atualizaOpcoes(opcoesCadastroWeb, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
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
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel
            label="Cod Fabricante"
            value={codFabricante}
            onChange={setCodFabricante}
          />
          <InputLabel
            label="Cod Interno"
            value={codInterno}
            onChange={setCodInterno}
          />
        </BarraLateral>
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
                  <h3>Nome:</h3>
                  <p>{nome}</p>
                </div>
                <hr />
                <div className="pai">
                  <h3>Pai:</h3>
                  <p>{pai}</p>
                </div>
                <div className="container-btn-cadastro">
                  <button
                    className="btn-cadastrar"
                    onClick={handleCadastrarProduto}
                  >
                    Cadastrar
                  </button>
                </div>
              </div>
              <div className="foto">
                <img src={itemSelecionado?.foto || ""} alt="" />
              </div>
            </div>
            <div className="container grade-corNova">
              <div className="inputs">
                <InputButton
                  placeholder="Adicionar cor nova"
                  icon="fa fa-plus"
                  value={corNova}
                  onChange={(e) => setCorNova(e.target.value.toUpperCase())}
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
                <Tabela dados={itemSelecionado?.grade} isLoading={false}>
                  {opcoesGrade.map((opcao) => (
                    <Coluna
                      key={opcao.id}
                      titulo={opcao.label}
                      campo={opcao.id}
                      format={opcao.format || ""}
                      dados={opcao.dados || []}
                    />
                  ))}
                </Tabela>
              </div>
            </div>
          </div>
          <div className="container-tabela">
            <Tabela
              dados={produtos}
              isLoading={false}
              hover
              select="checkbox"
              chave="COD_INTERNO" // Propriedade única para identificar cada item
              onSelectionChange={setItensSelecionados} // Função para receber os itens selecionados
              itemSelecionado={itemSelecionado}
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
                    onClick={(i) => {
                      handleItemSelecionado(i);
                    }}
                  />
                ))}
              <Coluna
                titulo="Cor"
                body={(item) => {
                  return (
                    <SelectLabel
                      search
                      options={cores}
                      value={item.COD_COR_ECOMMERCE}
                      label={null}
                      onChange={(newValue) => {
                        handleChangeCor(item.COD_INTERNO, newValue);
                      }}
                      onSearchChange={handleSearchCores}
                    />
                  );
                }}
              />
              <Coluna
                titulo="Ativo Ecommerce"
                format="checkbox"
                id="ATIVO_ECOMMERCE"
                state={ativosEcommerce}
                onChange={(index) => handleAtivoEcommerceChange(index)}
                onChangeAll={(checked) =>
                  handleAtivoEcommerceChangeAll(checked)
                }
                disabled={(item) =>
                  item.ALTURA === 0 ||
                  item.LARGURA === 0 ||
                  item.COMPRIMENTO === 0
                }
              />
            </Tabela>
          </div>
        </div>
      </div>
    </>
  );
};
export default CadastroWeb;
