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
import Toast from "../components/Toast";
import Content from "../components/Content";

import searchNotas from "../utils/search/searchNotas";

import vendedoresJson from "../assets/json/vendedores.json";
import ufsJson from "../assets/json/ufs.json";
import transportadorasJson from "../assets/json/transportadoras.json";

import opcoesNotas from "../assets/json/opcoes/opcoesNotas.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Notas = () => {
  // Token
  const token = localStorage.getItem("token");

  // Função do usuário
  const idFuncao = localStorage.getItem("ID_FUNCAO_USUARIO");

  // Estados dos inputs
  const [numNota, setNumNota] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [data, setData] = useState([null, null]);
  const [vendedor, setVendedor] = useState("");
  const [uf, setUf] = useState("");
  const [transportadora, setTransportadora] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Notas
  const [notas, setNotas] = useState([]);

  const handleSearch = async () => {
    setNotas([]);
    setIsLoading(true);
    const filtros = {
      token: token,
      numNota: numNota,
      cnpj: cnpj.replace(/\D/g, ""),
      dataInicial: data[0],
      dataFinal: data[1],
      vendedor: vendedor,
      uf: uf,
      transportadora: transportadora,
    };
    console.log(filtros);

    const response = await searchNotas(filtros);
    setIsLoading(false);

    if (response.success) {
      setNotas(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "Nenhuma nota fiscal encontrada com os filtros informados.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao buscar notas fiscais.",
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
              onChange={setVendedor}
              value={vendedor}
              onKeyDown={handleKeyDown}
            />
          )}
          <SelectLabel
            label="UF"
            options={ufsJson}
            onChange={setUf}
            value={uf}
            onKeyDown={handleKeyDown}
          />
          <SelectLabel
            label="Transportadora"
            options={transportadorasJson}
            onChange={setTransportadora}
            value={transportadora}
            onKeyDown={handleKeyDown}
          />
        </BarraLateral>
        <Content titulo="Notas Fiscais">
          <Tabela
            dados={notas}
            semDados="Nenhuma nota fiscal encontrada"
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
                  copy={opcao.copy || false}
                />
              ))}
          </Tabela>
        </Content>
      </div>
    </>
  );
};
export default Notas;
