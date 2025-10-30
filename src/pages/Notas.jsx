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

  // Usuário
  const idFuncao = JSON.parse(localStorage.getItem("ID_FUNCAO_USUARIO"));
  const username = localStorage.getItem("username");
  if (idFuncao == 2 && vendedor === "") {
    setVendedor(vendedoresJson.find((v) => v.label === username)?.value || "");
  }

  // Notas
  const [notas, setNotas] = useState([]);

  const handleSearch = async () => {
    setNotas([]);
    setIsLoading(true);
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
    setIsLoading(false);
    console.log(results);

    setNotas(results.data);
  };

  // Função para lidar com a tecla Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
          <InputLabel
            label="Num Nota"
            value={numNota}
            onChange={setNumNota}
            onKeyDown={handleKeyDown}
          />
          <InputDataLabel
            label="Data"
            value={data}
            onChange={setData}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Cnpj"
            value={cnpj}
            onChange={setCnpj}
            onKeyDown={handleKeyDown}
          />
          {idFuncao != 2 && (
            <SelectLabel
              label="Vendedores"
              options={vendedoresJson}
              onChange={(e) => setVendedor(e.target.value)}
              value={vendedor}
              onKeyDown={handleKeyDown}
            />
          )}
          <SelectLabel
            label="UF"
            options={ufsJson}
            onChange={(e) => setUf(e.target.value)}
            value={uf}
            onKeyDown={handleKeyDown}
          />
          <SelectLabel
            label="Transportadora"
            options={transportadorasJson}
            onChange={(e) => setTransportadora(e.target.value)}
            value={transportadora}
            onKeyDown={handleKeyDown}
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
