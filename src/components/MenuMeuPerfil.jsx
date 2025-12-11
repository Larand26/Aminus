import { useNavigate } from "react-router-dom";

import "../styles/menu-meu-perfil.css";

const MenuMeuPerfil = (props) => {
  const navigate = useNavigate();

  const handleMeuPerfilClick = () => {
    props.setMeuPerfilOpen(true); // Abre o PopUp do perfil
    props.setMenuOpen(false); // Fecha este menu
  };

  return (
    <div className={`menu-meu-perfil ${props.isOpen ? "open-menu" : ""}`}>
      <ul>
        <li>
          <button onClick={handleMeuPerfilClick}>
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
