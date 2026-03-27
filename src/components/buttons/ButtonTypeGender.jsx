import { Component } from "react";

import "../../styles/components/buttons/button-type-gender.css";

class ButtonTypeGender extends Component {
  render() {
    const { onClick, className, icon, key } = this.props;
    return (
      <button
        onClick={onClick}
        className={`button-type-gender ${className}`}
        key={key}
      >
        <i className={icon}></i>
      </button>
    );
  }
}

export default ButtonTypeGender;
