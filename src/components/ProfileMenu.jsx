import { Component } from "react";

import "../styles/menu-meu-perfil.css";

class ProfileMenu extends Component {
  render() {
    const { navigate, isOpen, setProfileMenuOpen } = this.props;
    return (
      <div className={`menu-meu-perfil ${isOpen ? "open-menu" : ""}`}>
        <ul>
          <li>
            <button onClick={() => setProfileMenuOpen(true)}>
              Meu Perfil <i className="fa fa-user"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Sair <i className="fa fa-sign-out"></i>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default ProfileMenu;
