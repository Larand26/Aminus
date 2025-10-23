import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";
import Card from "../components/Card";
import BotoesFotos from "../components/BotoesFotos";
import PopUp from "../components/PopUp";
import PopUpEditarFoto from "../components/popups/PopUpEditarFoto";

import searchFotos from "../utils/search/searchFotos";
import atualizaFotoMongo from "../utils/atualizaFotoMongo";

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
    const filters = {
      codFabricante: codFabricante,
      codInterno: codInterno,
      codCor: codCor,
    };
    const resultado = await searchFotos(filters);
    console.log(resultado);
    setFotos(resultado);
  };

  // Filtro
  const [filtro, setFiltro] = useState("");

  // PopUp
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const openPopUpEditar = (foto) => {
    setFotoSelecionada(foto);
    document.querySelector(`#editar-foto`).classList.add("open-pop-up");
    document.querySelector(".blur").classList.add("open-blur");
  };

  // Função que recebe os dados do pop-up ao fechar
  const handleCloseAndSave = async (updatedFoto) => {
    if (updatedFoto && Object.keys(updatedFoto).length > 0) {
      setFotos((prevFotos) =>
        prevFotos.map((foto) =>
          foto._id === updatedFoto._id ? updatedFoto : foto
        )
      );

      const resultado = await atualizaFotoMongo(updatedFoto);
      console.log(resultado);
    }
  };

  return (
    <>
      <PopUp
        id="editar-foto"
        onClose={() => setFotoSelecionada(null)}
        width="80%"
        height="700px"
      >
        {/* Renderiza o componente apenas se uma foto estiver selecionada */}
        {fotoSelecionada && (
          <PopUpEditarFoto
            foto={fotoSelecionada}
            onCloseAndSave={handleCloseAndSave}
          />
        )}
      </PopUp>
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
                <input
                  type="text"
                  className="filtro-fotos"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
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
                  fotos
                    .filter(
                      (foto) =>
                        foto.nome_cor
                          ?.toLowerCase()
                          .includes(filtro.toLowerCase()) ||
                        foto.codigo_cor
                          ?.toLowerCase()
                          .includes(filtro.toLowerCase())
                    )
                    .map((foto, index) => (
                      <Card
                        className="card-foto"
                        key={index}
                        foto={
                          foto.fotos?.foto_principal
                            ? `data:image/jpeg;base64,${foto.fotos.foto_principal}`
                            : unknown
                        }
                      >
                        <BotoesFotos
                          foto={foto}
                          data={index + 1}
                          onEditClick={() => {
                            openPopUpEditar(foto);
                          }}
                        />
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
