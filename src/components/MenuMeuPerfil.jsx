import { useNavigate } from "react-router-dom";

import "../styles/menu-meu-perfil.css";

const MenuMeuPerfil = () => {
  const navigate = useNavigate();
  return (
    <div className="menu-meu-perfil">
      <ul>
        <li>
          <button>
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
