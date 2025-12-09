import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuMeuPerfil from "./MenuMeuPerfil";
import PopUp from "./PopUp";
import PopUpMeuPerfil from "./popups/PopUpMeuPerfil";
import Gemini from "./Gemini";

import "../styles/nav-bar.css";
import "../styles/icons.css";

const NavBar = (props) => {
  const [isMeuPerfilOpen, setIsMeuPerfilOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 1. Estado para controlar o menu
  const navigate = useNavigate();

  // 2. Remover as funções que manipulam o DOM diretamente
  const openGemini = () => {
    document.querySelector("#gemini").classList.toggle("open-gemini-container");
  };
  const openConfiguracoes = () => {
    document
      .querySelector("#configuracoes")
      .classList.toggle("open-configuracoes-container");
  };

  const handleOpenMeuPerfil = () => {
    setIsMeuPerfilOpen(true);
    setIsMenuOpen(false); // 3. Fechar o menu ao abrir o popup
  };

  return (
    <>
      <Gemini />
      <PopUp
        id="meu-perfil-popup"
        isOpen={isMeuPerfilOpen}
        onClose={() => setIsMeuPerfilOpen(false)}
      >
        {/* Passando a prop isOpen para o filho */}
        <PopUpMeuPerfil isOpen={isMeuPerfilOpen} />
      </PopUp>
      {/* 4. Passar o estado e a função para o MenuMeuPerfil */}
      <MenuMeuPerfil
        onOpenMeuPerfil={handleOpenMeuPerfil}
        isOpen={isMenuOpen}
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
          {/* 5. O botão agora alterna o estado do menu */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="meu-perfil"></div>
          </button>
        </div>
      </div>
    </>
  );
};
export default NavBar;
