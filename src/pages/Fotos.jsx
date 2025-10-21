import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

const Fotos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codCor, setCodCor] = useState("");

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={() => {}}>
          <InputLabel
            label="Cod Fabricante"
            value={codFabricante}
            onChange={(e) => setCodFabricante(e.target.value)}
          />
          <InputLabel
            label="Cod Interno"
            value={codInterno}
            onChange={(e) => setCodInterno(e.target.value)}
          />
          <InputLabel
            label="Cod Cor"
            value={codCor}
            onChange={(e) => setCodCor(e.target.value)}
          />
        </BarraLateral>
      </div>
    </>
  );
};

export default Fotos;
