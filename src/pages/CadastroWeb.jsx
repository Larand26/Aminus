import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import SelectLabel from "../components/SelectLabel";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";

import searchCadastroWeb from "../utils/search/searchCadastroWeb";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import searchCores from "../utils/search/searchCores";

import opcoesCadastroWeb from "../assets/json/opcoes/opcoesCadastroWeb.json";
import coresTeste from "../assets/json/coresTeste.json";

import "../styles/CadastroWeb.css";

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
    }
  };

  // Estados da tabela
  const [cores, setCores] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);

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
          <div></div>
          <div className="container-tabela">
            <Tabela dados={produtos} isLoading={false} hover select="checkbox">
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
            </Tabela>
          </div>
        </div>
      </div>
    </>
  );
};
export default CadastroWeb;
