import { useEffect, useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";
import Card from "../components/Card";
import BotoesFotos from "../components/BotoesFotos";
import PopUp from "../components/PopUp";
import PopUpEditarFoto from "../components/popups/PopUpEditarFoto";
import Loading from "../components/Loading";

import searchFotos from "../utils/search/searchFotos";
import atualizaFotoMongo from "../utils/fotos/atualizaFotoMongo";
import deletaFoto from "../utils/fotos/deletaFoto";
import baixaFotos from "../utils/fotos/baixaFotos";

import unknown from "../assets/img/unknown.jpg";

import "../styles/fotos.css";

const Fotos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codCor, setCodCor] = useState("");

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Fotos
  const [fotos, setFotos] = useState([]);

  const handleSearch = async () => {
    setFotos([]);
    setIsLoading(true);
    const filters = {
      codFabricante: codFabricante,
      codInterno: codInterno,
      codCor: codCor,
    };
    const resultado = await searchFotos(filters);
    setIsLoading(false);
    console.log(resultado);
    setFotos(resultado);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Filtro
  const [filtro, setFiltro] = useState("");
  const filtrarFotos = () => {
    return fotos.filter(
      (foto) =>
        foto.nome_cor?.toLowerCase().includes(filtro.toLowerCase()) ||
        foto.codigo_cor?.toLowerCase().includes(filtro.toLowerCase())
    );
  };

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

  // Deletar foto
  const handleDeleteFoto = async (fotoId) => {
    if (!fotoId) return;

    const resultado = await deletaFoto(fotoId);
    console.log("Resultado da deleção:", resultado);
    if (resultado.success) {
      const fotosAtualizadas = fotos.filter((foto) => foto._id !== fotoId);
      setFotos(fotosAtualizadas);
    }
  };

  // Baixar fotos
  const [fotosSelecionadasDownload, setFotosSelecionadasDownload] = useState(
    []
  );
  const todasSelecionadas =
    fotos.length > 0 && fotosSelecionadasDownload.length === fotos.length;

  const handleSelecionaTodas = () => {
    if (todasSelecionadas) {
      setFotosSelecionadasDownload([]);
    } else {
      setFotosSelecionadasDownload(fotos);
    }
  };

  const handleBaixarFotos = async (foto, referencia) => {
    if (foto) {
      const resultado = await baixaFotos([foto], referencia);
    } else {
      const resultado = await baixaFotos(fotosSelecionadasDownload, referencia);
    }
  };

  // Selecionar foto para baixar
  const selecionaFoto = (foto) => {
    if (!foto) return;

    const isSelected = fotosSelecionadasDownload.some(
      (f) => f._id === foto._id
    );

    if (isSelected) {
      setFotosSelecionadasDownload((prev) =>
        prev.filter((f) => f._id !== foto._id)
      );
    } else {
      setFotosSelecionadasDownload((prev) => [...prev, foto]);
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
            onKeyDown={handleKeyDown}
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
                <CheckBox
                  id="foto1"
                  checked={todasSelecionadas}
                  onChange={handleSelecionaTodas}
                />
                <button
                  className="btn-baixar-foto"
                  onClick={() => handleBaixarFotos(null, null)}
                >
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
                {isLoading && <Loading />}
                {filtrarFotos().map((foto, index) => {
                  const isSelected = fotosSelecionadasDownload.some(
                    (f) => f._id === foto._id
                  );
                  return (
                    <Card
                      onClick={() => selecionaFoto(foto)}
                      className={`card-foto${
                        isSelected ? " card-selected" : ""
                      }`}
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
                        onConfirmDelete={() => handleDeleteFoto(foto._id)}
                        onEditClick={() => {
                          openPopUpEditar(foto);
                        }}
                        onDownloadClick={() =>
                          handleBaixarFotos(foto, foto.referencia)
                        }
                      />
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fotos;
