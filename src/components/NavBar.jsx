import { useNavigate } from "react-router-dom";

import MenuMeuPerfil from "./MenuMeuPerfil";
import PopUp from "./PopUp";
import PopUpMeuPerfil from "./PopUps/PopUpMeuPerfil";
import Gemini from "./Gemini";

import "../styles/nav-bar.css";
import "../styles/icons.css";

const NavBar = (props) => {
  const navigate = useNavigate();
  const openMenu = () => {
    document.querySelector(".menu-meu-perfil").classList.toggle("open-menu");
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
      <PopUp id="meu-perfil-popup">
        <PopUpMeuPerfil />
      </PopUp>
      <MenuMeuPerfil />
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
