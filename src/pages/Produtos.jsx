import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

const Produtos = () => {
  const [codFabricante, setCodFabricante] = useState("");
  return (
    <>
      <NavBar />
      <BarraLateral>
        <InputLabel
          label="Cod Fabricante"
          value={codFabricante}
          onChange={setCodFabricante}
        />
      </BarraLateral>
      <div className="content"></div>
    </>
  );
};

export default Produtos;
