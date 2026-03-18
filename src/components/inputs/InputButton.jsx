import { Component } from "react";

import Button from "../buttons/Button.jsx";

import "../../styles/components/inputs/input-button.css";

class InputButton extends Component {
  render() {
    const {
      value = "",
      onChange = () => {},
      onClick = () => {},
      label = "",
      placeholder = "",
      icon = "",
    } = this.props;

    return (
      <div className="input-button">
        <label>{label}</label>
        <div className="input-button-container">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <Button onClick={onClick} icon={icon} />
        </div>
      </div>
    );
  }
}

export default InputButton;
