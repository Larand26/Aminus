import { Component } from "react";

import "../../styles/components/buttons/button-type-gender.css";

class ButtonTypeGender extends Component {
  render() {
    const { onClick, className, icon } = this.props;
    return (
      <button onClick={onClick} className={`button-type-gender ${className}`}>
        <i className={icon}></i>
      </button>
    );
  }
}

export default ButtonTypeGender;
