import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";

import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

import searchPedidos from "../utils/search/searchPedidos";

import vendedoresJson from "../assets/json/vendedores.json";

const Pedidos = () => {
  // Estados dos inputs
  const [numPedido, setNumPedido] = useState("");
  const [data, setData] = useState([null, null]);
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Pedidos
  const [pedidos, setPedidos] = useState([]);

  const handleSearch = async () => {
    const filters = {
      numPedido: numPedido,
      dataInicial: data[0],
      dataFinal: data[1],
      cliente: cliente,
      cnpj: cnpj,
      vendedor: vendedor,
    };

    const results = await searchPedidos(filters);
    setPedidos(results.data);
    console.log(results);
  };
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel
            label="Num Pedido"
            value={numPedido}
            onChange={setNumPedido}
          />
          <InputDataLabel label="Data" value={data} onChange={setData} />
          <InputLabel label="Cliente" value={cliente} onChange={setCliente} />
          <InputLabel label="CNPJ" value={cnpj} onChange={setCnpj} />
          <SelectLabel
            options={vendedoresJson}
            label="Vendedor"
            value={vendedor}
            onChange={setVendedor}
          />
        </BarraLateral>
      </div>
    </>
  );
};

export default Pedidos;
