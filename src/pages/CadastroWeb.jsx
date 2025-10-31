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

import opcoesCadastroWeb from "../assets/json/opcoes/opcoesCadastroWeb.json";
import coresTeste from "../assets/json/coresTeste.json";

import "../styles/pages/CadastroWeb.css";

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
        <div className="content">
          <div></div>
          <div className="container-tabela">
            <Tabela dados={produtos} isLoading={false} hover>
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
                      options={coresTeste}
                      value={item.cor}
                      label={null}
                      onChange={(newValue) => {
                        // Atualiza a cor do item
                        setProdutos((prevProdutos) =>
                          prevProdutos.map((p) =>
                            p.id === item.id ? { ...p, cor: newValue } : p
                          )
                        );
                      }}
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
