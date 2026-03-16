import { Component } from "react";

import SearchButton from "./SearchButton";

import "../styles/side-bar.css";

class SideBar extends Component {
  render() {
    const { onSearch, children } = this.props;
    return (
      <div className="side-bar">
        {children}
        {onSearch && <SearchButton onClick={onSearch} />}
      </div>
    );
  }
}

export default SideBar;
