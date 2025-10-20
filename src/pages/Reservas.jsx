import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";

import vendedoresJson from "../assets/json/vendedores.json";

import searchReservas from "../utils/search/searchReservas";

const Reservas = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [numPedido, setNumPedido] = useState("");
  const [nomePedido, setNomePedido] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Reservas
  const [reservas, setReservas] = useState([]);
  
  const handleSearch = async () => {
    const filters = {
      codFabricante: codFabricante,
      codInterno: codInterno,
      numPedido: numPedido,
      nomePedido: nomePedido,
      vendedor: vendedor,
    };

    const results = await searchReservas(filters);
    setReservas(results.data);
    console.log(results);
  }

  return (
    <>
      <NavBar />
      <BarraLateral onSearch={handleSearch}>
        <InputLabel label="Cod Fabricante" value={codFabricante} onChange={setCodFabricante} />
        <InputLabel label="Cod Interno" value={codInterno} onChange={setCodInterno} />
        <InputLabel label="Num Pedido" value={numPedido} onChange={setNumPedido} />
        <InputLabel label="Nome Pedido" value={nomePedido} onChange={setNomePedido} />
        <SelectLabel label="Vendedor" options={vendedoresJson} value={vendedor} onChange={setVendedor} />
      </BarraLateral>
    </>
  );
};
export default Reservas;
