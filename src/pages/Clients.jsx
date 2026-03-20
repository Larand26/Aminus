import { useState } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import InputLabel from "../components/inputs/InputText";
import Tabela from "../components/table/Table";
import Toast from "../components/misc/Toast";
import Content from "../components/misc/Content";

import searchClients from "../utils/search/searchClientes";
import atualizaOpcoes from "../utils/atualizaOpcoes";

import opcoesClientes from "../assets/json/opcoes/opcoesClientes.json";

const Clients = () => {
  // Input states
  const [clientNumber, setClientNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Clients
  const [clients, setClients] = useState([]);

  const handleSearch = async () => {
    setClients([]);
    setIsLoading(true);
    const filters = {
      numCliente: clientNumber,
      nome: clientName,
      cnpj: cnpj.replace(/\D/g, ""),
      celular: phone,
      email,
    };
    const response = await searchClients(filters);
    setIsLoading(false);
    // console.log(response);

    if (response.success) {
      setClients(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No clients found with the selected filters.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching clients.",
        type: "falha",
      });
    }
  };

  // Handles Enter key submit
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Options
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesClientes");
    return atualizaOpcoes(opcoesClientes, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesClientes", JSON.stringify(updatedOptions));
  };

  return (
    <>
      <NavBar />
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
      <div className="main-container">
        <SideBar onSearch={handleSearch}>
          <InputLabel
            label="Client Number"
            type="text"
            value={clientNumber}
            onChange={setClientNumber}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Client Name"
            type="text"
            value={clientName}
            onChange={setClientName}
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
            label="Phone"
            type="text"
            value={phone}
            onChange={setPhone}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            onKeyDown={handleKeyDown}
          />
        </SideBar>
        <Content titulo="Clients">
          <Tabela
            dados={clients}
            semDados="No clients found"
            loading={isLoading}
            search={opcoes.find((opcao) => opcao.id === "search").checked}
          ></Tabela>
        </Content>
      </div>
    </>
  );
};
export default Clients;
