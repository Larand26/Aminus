import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";

import "../styles/fotos.css";

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
        <div className="content">
          <div className="content-title">
            <h1>Fotos</h1>
          </div>
          <div className="container-fotos">
            <div className="navBar-fotos">
              <div>
                <input type="text" className="filtro-fotos" />
                <CheckBox id="foto1" checked={false} onChange={() => {}} />
                <button className="btn-baixar-foto">
                  Baixar Fotos
                  <i className="fa fa-download"></i>
                </button>
              </div>
              <div>
                <button className="btn-adicionar-foto">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fotos;
