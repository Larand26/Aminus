import { Component } from "react";

import "../../styles/components/inputs/radio.css";

class Radio extends Component {
  render() {
    const { checked, onChange } = this.props;
    return (
      <div
        className={`input-radio ${checked ? "checked-input-radio" : ""}`}
        onClick={onChange}
      >
        <input type="radio" checked={checked} readOnly />
      </div>
    );
  }
}

export default Radio;
