import { Component } from "react";

import Button from "./Button";

import "../../styles/components/buttons/search-button.css";

class SearchButton extends Component {
  render() {
    const { onClick, text } = this.props;

    return (
      <Button
        className="search-button"
        text={text || "Pesquisar"}
        onClick={onClick}
        icon={"fa fa-search"}
      />
    );
  }
}

export default SearchButton;
