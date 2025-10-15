import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

import vendedoresJson from "../assets/json/vendedores.json";

const Notas = () => {
  const [vendedor, setVendedor] = useState("");
  const [data, setData] = useState([null, null]);

  const formatarData = (data) => {
    if (!data) return "";
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <NavBar />
      <BarraLateral>
        <SelectLabel
          label="Status"
          options={vendedoresJson}
          onChange={(e) => setVendedor(e.target.value)}
        />
        <InputDataLabel label="Data" onChange={(value) => setData(value)} />
      </BarraLateral>
    </>
  );
};
export default Notas;
