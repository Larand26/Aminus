import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";

const Fotos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codCor, setCodCor] = useState("");

  const [c, setC] = useState(false);

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
        <div className="content">
          <div className="content-title">
            <h1>Fotos</h1>
          </div>
          <div className="container-fotos">
            <div className="navBar-fotos">
              <CheckBox id="foto1" checked={c} onChange={() => setC(!c)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fotos;
