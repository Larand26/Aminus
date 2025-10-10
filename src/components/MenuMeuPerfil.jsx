import { useNavigate } from "react-router-dom";

import "../styles/menu-meu-perfil.css";

const MenuMeuPerfil = () => {
  const navigate = useNavigate();
  const openPopup = () => {
    document.querySelector(".pop-up").classList.toggle("open-pop-up");
    document.querySelector(".blur").classList.toggle("open-blur");
  };
  const closeMenu = () => {
    document.querySelector(".menu-meu-perfil").classList.remove("open-menu");
  };
  return (
    <div className="menu-meu-perfil">
      <ul>
        <li>
          <button
            onClick={() => {
              openPopup();
              closeMenu();
            }}
          >
            Meu Perfil <i className="fa fa-user"></i>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/")}>
            Sair <i className="fa fa-sign-out"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};
export default MenuMeuPerfil;
