import { Component } from "react";

import ProfileMenu from "../ProfileMenu";
import Configuration from "./Configuration";

import PopUpProfile from "../popups/PopUpProfile";

import "../../styles/components/misc/nav-bar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileOpen: false,
      isSettingsOpen: false,
      isMenuOpen: false,
      isSettingsOpen: false,
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
    this.setState((prevState) => ({
      isSettingsOpen: !prevState.isSettingsOpen,
    }));
  };

  navigateHome = () => {
    window.location.hash = "#/home";
  };

  render() {
    const { isProfileOpen, isMenuOpen, isSettingsOpen } = this.state;
    const { page, settings } = this.props;

    return (
      <>
        {settings && settings.length > 0 && (
          <Configuration isOpen={isSettingsOpen} configs={settings} />
        )}
        <PopUpProfile
          isOpen={isProfileOpen}
          onClose={() => this.setProfileOpen(false)}
        />
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
            {settings && settings.length > 0 && (
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
