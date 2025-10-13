import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

const Produtos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codBarras, setCodBarras] = useState("");
  const [nome, setNome] = useState("");
  return (
    <>
      <NavBar />
      <BarraLateral search={true}>
        <InputLabel
          label="Cod Fabricante"
          value={codFabricante}
          onChange={setCodFabricante}
        />
        <InputLabel
          label="Cod Interno"
          value={codInterno}
          onChange={setCodInterno}
        />
        <InputLabel
          label="Cod Barras"
          value={codBarras}
          onChange={setCodBarras}
        />
        <InputLabel label="Nome" value={nome} onChange={setNome} />
      </BarraLateral>
      <div className="content"></div>
    </>
  );
};

export default Produtos;
