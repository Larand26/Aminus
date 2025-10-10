import { useNavigate } from "react-router-dom";

import "../styles/nav-bar.css";
import "../styles/icons.css";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="nav-bar">
      <div className="home">
        <button onClick={() => navigate("/home")}>
          <i className="fa fa-home"></i>
        </button>
      </div>
      <div className="actions">
        <button>
          <i className="fa fa-cog"></i>
        </button>
        <button>
          <i className="icon-gemini"></i>
        </button>
        <button>
          <div className="meu-perfil"></div>
        </button>
      </div>
    </div>
  );
};
export default NavBar;
