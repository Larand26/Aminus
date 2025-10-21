import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";
import Card from "../components/Card";
import BotoesFotos from "../components/BotoesFotos";

import searchFotos from "../utils/search/searchFotos";

import unknown from "../assets/img/unknown.jpg";

import "../styles/fotos.css";

const Fotos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codCor, setCodCor] = useState("");

  // Fotos
  const [fotos, setFotos] = useState([]);

  const handleSearch = async () => {
    const filtros = {
      codFabricante: codFabricante,
      codInterno: codInterno,
      codCor: codCor,
    };
    const resultado = await searchFotos(filtros);
    console.log(resultado);
    setFotos(resultado);
  };

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
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
          <InputLabel label="Cod Cor" value={codCor} onChange={setCodCor} />
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
            <div className="content-fotos">
              <div className="fotos">
                {fotos &&
                  fotos.map((foto, index) => (
                    <Card
                      className="card-foto card-selected"
                      key={index}
                      foto={
                        foto.fotos?.foto_principal
                          ? `data:image/jpeg;base64,${foto.fotos.foto_principal}`
                          : unknown
                      }
                    >
                      <BotoesFotos foto={foto} />
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fotos;
