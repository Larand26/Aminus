import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";
import SearchButton from "../components/SearchButton";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";

import vendedoresJson from "../assets/json/vendedores.json";
import ufsJson from "../assets/json/ufs.json";
import transportadorasJson from "../assets/json/transportadoras.json";

import opcoesNotas from "../assets/json/opcoes/opcoesProdutos.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Notas = () => {
  // Estados dos inputs
  const [numNota, setNumNota] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [data, setData] = useState([null, null]);
  const [vendedor, setVendedor] = useState("");
  const [uf, setUf] = useState("");
  const [transportadora, setTransportadora] = useState("");

  // Notas
  const [notas, setNotas] = useState([]);

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesNotas");
    return atualizaOpcoes(opcoesNotas, savedOpcoes);
  });

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral>
          <InputLabel
            label="Num Nota"
            value={numNota}
            onChange={(e) => setNumNota(e.target.value)}
          />
          <InputDataLabel
            label="Data"
            value={data}
            onChange={(value) => setData(value)}
          />
          <InputLabel
            label="Cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          <SelectLabel
            label="Vendedores"
            options={vendedoresJson}
            onChange={(e) => setVendedor(e.target.value)}
            value={vendedor}
          />
          <SelectLabel
            label="UF"
            options={ufsJson}
            onChange={(e) => setUf(e.target.value)}
            value={uf}
          />
          <SelectLabel
            label="Transportadora"
            options={transportadorasJson}
            onChange={(e) => setTransportadora(e.target.value)}
            value={transportadora}
          />
          <SearchButton />
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Produtos</h1>
          </div>
          <Tabela dados={notas} semDados="Nenhum produto encontrado">
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
        </div>
      </div>
    </>
  );
};
export default Notas;
