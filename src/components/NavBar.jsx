import { useNavigate } from "react-router-dom";
import { useState } from "react";

import MenuMeuPerfil from "./MenuMeuPerfil";
import PopUp from "./PopUp";
import PopUpMeuPerfil from "./PopUps/PopUpMeuPerfil";
import Gemini from "./Gemini";

import "../styles/nav-bar.css";
import "../styles/icons.css";

const NavBar = (props) => {
  const navigate = useNavigate();

  // PopUps
  const [meuPerfilOpen, setMeuPerfilOpen] = useState(false);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const openGemini = () => {
    document.querySelector("#gemini").classList.toggle("open-gemini-container");
  };
  const openConfiguracoes = () => {
    document
      .querySelector("#configuracoes")
      .classList.toggle("open-configuracoes-container");
  };
  return (
    <>
      <Gemini />
      <PopUp
        id="meu-perfil-popup"
        open={meuPerfilOpen}
        setOpen={setMeuPerfilOpen}
      >
        <PopUpMeuPerfil />
      </PopUp>
      <MenuMeuPerfil
        isOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setMeuPerfilOpen={setMeuPerfilOpen}
      />
      <div className="nav-bar">
        <div className="home">
          <button onClick={() => navigate("/home")}>
            <i className="fa fa-home"></i>
          </button>
        </div>
        <div className="actions">
          {props.page !== "home" && (
            <button onClick={openConfiguracoes}>
              <i className="fa fa-cog"></i>
            </button>
          )}
          <button onClick={openGemini}>
            <i className="icon-gemini"></i>
          </button>
          <button onClick={openMenu}>
            <div className="meu-perfil"></div>
          </button>
        </div>
      </div>
    </>
  );
};
export default NavBar;
