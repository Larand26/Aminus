import { Component } from "react";

import SearchButton from "./SearchButton";

import "../styles/barra-lateral.css";

class BarraLateral extends Component {
  render() {
    const { onSearch, children } = this.props;
    return (
      <div className="barra-lateral">
        {children}
        {onSearch && <SearchButton onClick={onSearch} />}
      </div>
    );
  }
}

export default BarraLateral;
