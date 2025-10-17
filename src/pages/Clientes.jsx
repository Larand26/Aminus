import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

import searchClientes from "../utils/search/searchClientes";

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

  return (
    <>
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
