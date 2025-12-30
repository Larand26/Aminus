import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import Toast from "../components/Toast";
import Content from "../components/Content";

import searchClientes from "../utils/search/searchClientes";
import atualizaOpcoes from "../utils/atualizaOpcoes";

import opcoesClientes from "../assets/json/opcoes/opcoesClientes.json";

const Clientes = () => {
  // Estados dos inputs
  const [numCliente, setNumCliente] = useState("");
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Clientes
  const [clientes, setClientes] = useState([]);

  const handleSearch = async () => {
    setClientes([]);
    setIsLoading(true);
    const filters = {
      numCliente,
      nome,
      cnpj: cnpj.replace(/\D/g, ""),
      celular,
      email,
    };
    const response = await searchClientes(filters);
    setIsLoading(false);
    // console.log(response);

    if (response.success) {
      setClientes(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "Nenhum cliente encontrado com os filtros informados.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao buscar clientes.",
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

  // Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesClientes");
    return atualizaOpcoes(opcoesClientes, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesClientes", JSON.stringify(updatedOptions));
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
            label="Número do Cliente"
            type="text"
            value={numCliente}
            onChange={setNumCliente}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Nome do Cliente"
            type="text"
            value={nome}
            onChange={setNome}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="CNPJ"
            type="text"
            value={cnpj}
            onChange={setCnpj}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Celular"
            type="text"
            value={celular}
            onChange={setCelular}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            onKeyDown={handleKeyDown}
          />
        </BarraLateral>
        <Content titulo="Clientes">
          <Tabela
            dados={clientes}
            semDados="Nenhum cliente encontrado"
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
                />
              ))}
          </Tabela>
        </Content>
      </div>
    </>
  );
};
export default Clientes;
