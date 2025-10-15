import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";

import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

const Pedidos = () => {
  // Estados dos inputs
  const [numPedido, setNumPedido] = useState("");
  const [data, setData] = useState([null, null]);
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [vendedor, setVendedor] = useState("");
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral>
          <InputLabel
            label="Num Pedido"
            value={numPedido}
            onChange={setNumPedido}
          />
          <InputDataLabel label="Data" value={data} onChange={setData} />
          <InputLabel label="Cliente" value={cliente} onChange={setCliente} />
          <InputLabel label="CNPJ" value={cnpj} onChange={setCnpj} />
          <InputLabel
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
