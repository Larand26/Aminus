import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";

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

  // Clientes
  const [clientes, setClientes] = useState([]);

  const handleSearch = async () => {
    const filters = {
      numCliente,
      nome,
      cnpj,
      celular,
      email,
    };
    const response = await searchClientes(filters);

    console.log(response);

    if (response.success) {
      setClientes(response.data);
    } else {
      console.error("Erro ao buscar clientes:", response.error);
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
      <BarraLateral onSearch={handleSearch}>
        <InputLabel
          label="Número do Cliente"
          type="text"
          value={numCliente}
          onChange={setNumCliente}
        />
        <InputLabel
          label="Nome do Cliente"
          type="text"
          value={nome}
          onChange={setNome}
        />
        <InputLabel label="CNPJ" type="text" value={cnpj} onChange={setCnpj} />
        <InputLabel
          label="Celular"
          type="text"
          value={celular}
          onChange={setCelular}
        />
        <InputLabel
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
      </BarraLateral>
      <div className="main-container"></div>
    </>
  );
};
export default Clientes;
