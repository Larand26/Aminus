import { useState } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Select from "../components/inputs/Select";
import InputLabel from "../components/inputs/InputText";
import InputDataLabel from "../components/inputs/InputDate";
import Tabela from "../components/table/Table";
import Toast from "../components/misc/Toast";
import Content from "../components/misc/Content";

import searchInvoices from "../utils/search/searchNotas";

import vendedoresJson from "../assets/json/vendedores.json";
import ufsJson from "../assets/json/ufs.json";
import transportadorasJson from "../assets/json/transportadoras.json";

import opcoesNotas from "../assets/json/opcoes/opcoesNotas.json";

import atualizaOpcoes from "../utils/atualizaOpcoes";

const Invoices = () => {
  // Token
  const token = localStorage.getItem("token");

  // User role
  const userRoleId = localStorage.getItem("ID_FUNCAO_USUARIO");

  // Input states
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [seller, setSeller] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [carrier, setCarrier] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Invoices
  const [invoices, setInvoices] = useState([]);

  const handleSearch = async () => {
    setInvoices([]);
    setIsLoading(true);
    const filters = {
      token: token,
      numNota: invoiceNumber,
      cnpj: cnpj.replace(/\D/g, ""),
      dataInicial: dateRange[0],
      dataFinal: dateRange[1],
      vendedor: seller,
      uf: stateCode,
      transportadora: carrier,
    };
    console.log(filters);

    const response = await searchInvoices(filters);
    setIsLoading(false);

    if (response.success) {
      setInvoices(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No invoices found with the selected filters.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching invoices.",
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
  const [options, setOptions] = useState(() => {
    const savedOptions = localStorage.getItem("opcoesNotas");
    return atualizaOpcoes(opcoesNotas, savedOptions);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, checked: !option.checked } : option,
    );
    setOptions(updatedOptions);
    localStorage.setItem("opcoesNotas", JSON.stringify(updatedOptions));
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
            label="Invoice No."
            value={invoiceNumber}
            onChange={setInvoiceNumber}
            onKeyDown={handleKeyDown}
          />
          <InputDataLabel
            label="Date"
            value={dateRange}
            onChange={setDateRange}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="CNPJ"
            value={cnpj}
            onChange={setCnpj}
            onKeyDown={handleKeyDown}
          />
          {userRoleId != 2 && (
            <Select
              label="Sellers"
              options={vendedoresJson}
              onChange={setSeller}
              value={seller}
              onKeyDown={handleKeyDown}
            />
          )}
          <Select
            label="State"
            options={ufsJson}
            onChange={setStateCode}
            value={stateCode}
            onKeyDown={handleKeyDown}
          />
          <Select
            label="Carrier"
            options={transportadorasJson}
            onChange={setCarrier}
            value={carrier}
            onKeyDown={handleKeyDown}
          />
        </SideBar>
        <Content titulo="Invoices">
          <Tabela
            dados={invoices}
            semDados="No invoices found"
            loading={isLoading}
            search={options.find((option) => option.id === "search").checked}
          ></Tabela>
        </Content>
      </div>
    </>
  );
};
export default Invoices;
