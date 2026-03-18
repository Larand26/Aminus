import { Component } from "react";

import "../../styles/components/inputs/checkbox.css";

class CheckBox extends Component {
  render() {
    const { label, checked, onChange } = this.props;
    return (
      <label className="checkbox-container">
        {label}
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="checkmark">
          <i className="fa fa-check"></i>
        </span>
      </label>
    );
  }
}

export default CheckBox;
