import { Component } from "react";

import "../../styles/components/menu/menu-profile.css";

class ProfileMenu extends Component {
  render() {
    const { isOpen, setProfileMenuOpen, setMenuOpen } = this.props;
    return (
      <div className={`menu-meu-perfil ${isOpen ? "open-menu" : ""}`}>
        <ul>
          <li>
            <button
              onClick={() => {
                setProfileMenuOpen(true);
                setMenuOpen(false);
              }}
            >
              Meu Perfil <i className="fa fa-user"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setMenuOpen(false);
                window.location.hash = "#/";
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
