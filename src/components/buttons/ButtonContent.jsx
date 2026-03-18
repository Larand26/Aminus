import { Component } from "react";

import "../../styles/components/buttons/button-content.css";

class ButtonContent extends Component {
  render() {
    const { onClick, icon, className } = this.props;
    return (
      <button className={`button-content ${className || ""}`} onClick={onClick}>
        <i className={icon}></i>
      </button>
    );
  }
}
export default ButtonContent;
