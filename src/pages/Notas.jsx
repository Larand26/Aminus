import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";

import searchNotas from "../utils/search/searchNotas";

import vendedoresJson from "../assets/json/vendedores.json";
import ufsJson from "../assets/json/ufs.json";
import transportadorasJson from "../assets/json/transportadoras.json";

import opcoesNotas from "../assets/json/opcoes/opcoesNotas.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Notas = () => {
  // Estados dos inputs
  const [numNota, setNumNota] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [data, setData] = useState([null, null]);
  const [vendedor, setVendedor] = useState("");
  const [uf, setUf] = useState("");
  const [transportadora, setTransportadora] = useState("");

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Notas
  const [notas, setNotas] = useState([]);

  const handleSearch = async () => {
    const filtros = {
      numNota: numNota,
      cnpj: cnpj,
      dataInicial: data[0],
      dataFinal: data[1],
      vendedor: vendedor,
      uf: uf,
      transportadora: transportadora,
    };

    const results = await searchNotas(filtros);
    console.log(results);

    setNotas(results.data);
  };

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesNotas");
    return atualizaOpcoes(opcoesNotas, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesNotas", JSON.stringify(updatedOptions));
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
          <InputLabel label="Num Nota" value={numNota} onChange={setNumNota} />
          <InputDataLabel label="Data" value={data} onChange={setData} />
          <InputLabel label="Cnpj" value={cnpj} onChange={setCnpj} />
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
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Notas fiscais</h1>
          </div>
          <Tabela
            dados={notas}
            semDados="Nenhuma nota fiscal encontrada"
            loading={isLoading}
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
        </div>
      </div>
    </>
  );
};
export default Notas;
