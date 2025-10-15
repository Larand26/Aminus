import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

import vendedoresJson from "../assets/json/vendedores.json";

const Notas = () => {
  const [vendedor, setVendedor] = useState("");

  return (
    <>
      <NavBar />
      <BarraLateral>
        <SelectLabel
          label="Status"
          options={vendedoresJson}
          onChange={(e) => setVendedor(e.target.value)}
        />
        <InputDataLabel label="Data" />
      </BarraLateral>
    </>
  );
};
export default Notas;
