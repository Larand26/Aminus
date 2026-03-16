import { Component } from "react";

import "../../styles/components/inputs/input_text.css";

class InputText extends Component {
  render() {
    const {
      label = "",
      value = "",
      onChange = () => {},
      className = "",
      placeholder = "",
    } = this.props;
    return (
      <div className={`input-text-container ${className || ""}`}>
        {label && <label>{label}</label>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default InputText;
