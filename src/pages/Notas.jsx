import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

import vendedoresJson from "../assets/json/vendedores.json";
import ufsJson from "../assets/json/ufs.json";
import transportadorasJson from "../assets/json/transportadoras.json";

const Notas = () => {
  // Estados dos inputs
  const [numNota, setNumNota] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [data, setData] = useState([null, null]);
  const [vendedor, setVendedor] = useState("");
  const [uf, setUf] = useState("");
  const [transportadora, setTransportadora] = useState("");

  const formatarData = (data) => {
    if (!data) return "";
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <NavBar />
      <BarraLateral>
        <InputLabel
          label="Num Nota"
          value={numNota}
          onChange={(e) => setNumNota(e.target.value)}
        />
        <InputDataLabel
          label="Data"
          value={data}
          onChange={(value) => setData(value)}
        />
        <InputLabel
          label="Cnpj"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />
        <SelectLabel
          label="Vendedores"
          options={vendedoresJson}
          onChange={(e) => setVendedor(e.target.value)}
          value={vendedor}
        />
        <SelectLabel
          label="UF"
          options={ufsJson}
          onChange={(e) => setUf(e.target.value)}
          value={uf}
        />
        <SelectLabel
          label="Transportadora"
          options={transportadorasJson}
          onChange={(e) => setTransportadora(e.target.value)}
          value={transportadora}
        />
      </BarraLateral>
    </>
  );
};
export default Notas;
