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

import opcoesCadastroWeb from "../assets/json/opcoes/opcoesCadastroWeb.json";
import coresTeste from "../assets/json/coresTeste.json";
import opcoesGrade from "../assets/json/opcoes/opcoesGrade.json";

import "../styles/cadastro-web.css";

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

    const itemAtualizado = await atualizaItemSelecionado(item);
    console.log("Item selecionado atualizado no componente:", itemAtualizado);
    setItemSelecionado(itemAtualizado);
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
                  <BotaoTipoGen
                    icon="icon-male"
                    className={
                      itemSelecionado?.genero === "MASCULINO"
                        ? "selecionado"
                        : ""
                    }
                  />
                  <BotaoTipoGen
                    icon="icon-female"
                    className={
                      itemSelecionado?.genero === "FEMININO"
                        ? "selecionado"
                        : ""
                    }
                  />
                  <BotaoTipoGen
                    icon="icon-child"
                    className={
                      itemSelecionado?.genero === "INFANTIL"
                        ? "selecionado"
                        : ""
                    }
                  />
                  <BotaoTipoGen
                    icon="icon-baby"
                    className={
                      itemSelecionado?.genero === "BABY" ? "selecionado" : ""
                    }
                  />
                  <BotaoTipoGen
                    icon="icon-unisex"
                    className={
                      itemSelecionado?.genero === "BABY" ? "selecionado" : ""
                    }
                  />
                  <BotaoTipoGen
                    icon="icon-promo"
                    className={
                      itemSelecionado?.colecao === "PROMO" ? "selecionado" : ""
                    }
                  />
                </div>
              </div>
              <div className="container-tipo">
                <div className="tipos">
                  <BotaoTipoGen icon="icon-chinelo" />
                  <BotaoTipoGen icon="icon-sandalia" />
                  <BotaoTipoGen icon="icon-rasteira" />
                  <BotaoTipoGen icon="icon-slide" />
                  <BotaoTipoGen icon="icon-tamanco" />
                  <BotaoTipoGen icon="icon-babuche" />
                  <BotaoTipoGen icon="icon-sapato" />
                  <BotaoTipoGen icon="icon-sapatilha" />
                  <BotaoTipoGen icon="icon-bota" />
                </div>
              </div>
            </div>
            <div className="container display">
              <div className="nome-pai">
                <div className="nome-produto">
                  <h3>Nome:</h3>
                  <p>{produtos[0]?.PROD_DESCRICAO || ""}</p>
                </div>
                <hr />
                <div className="pai">
                  <h3>Pai:</h3>
                  <p>{produtos[0]?.PAI || ""}</p>
                </div>
                <div className="container-btn-cadastro">
                  <button className="btn-cadastrar">Cadastrar</button>
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
                  onClick={() => {}}
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
              />
            </Tabela>
          </div>
        </div>
      </div>
    </>
  );
};
export default CadastroWeb;
