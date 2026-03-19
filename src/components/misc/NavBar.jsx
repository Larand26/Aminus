import { Component } from "react";

import ProfileMenu from "../ProfileMenu";
import PopUp from "../PopUp";
import ProfilePopupContent from "../PopUps/PopUpMeuPerfil";

import "../../styles/components/misc/nav-bar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileOpen: false,
      isSettingsOpen: false,
      isMenuOpen: false,
    };
  }

  setProfileOpen = (value) => {
    this.setState((prevState) => ({
      isProfileOpen:
        typeof value === "function" ? value(prevState.isProfileOpen) : value,
    }));
  };

  setMenuOpen = (value) => {
    this.setState((prevState) => ({
      isMenuOpen:
        typeof value === "function" ? value(prevState.isMenuOpen) : value,
    }));
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  toggleSettings = () => {
    document
      .querySelector("#configuracoes")
      .classList.toggle("open-configuracoes-container");
  };

  navigateHome = () => {
    window.location.hash = "#/home";
  };

  render() {
    const { isProfileOpen, isMenuOpen } = this.state;
    const { page } = this.props;

    return (
      <>
        <PopUp
          id="meu-perfil-popup"
          open={isProfileOpen}
          setOpen={this.setProfileOpen}
        >
          <ProfilePopupContent />
        </PopUp>
        <ProfileMenu
          isOpen={isMenuOpen}
          setMenuOpen={this.setMenuOpen}
          setProfileMenuOpen={this.setProfileOpen}
        />
        <div className="nav-bar">
          <div className="home">
            <button onClick={this.navigateHome}>
              <i className="fa fa-home"></i>
            </button>
          </div>
          <div className="actions">
            {page !== "home" && (
              <button onClick={this.toggleSettings}>
                <i className="fa fa-cog"></i>
              </button>
            )}
            <button onClick={this.toggleMenu}>
              <div className="meu-perfil"></div>
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default NavBar;
