import { Component } from "react";

import "../../styles/components/inputs/checkbox.css";

class CheckBox extends Component {
  render() {
    const { label, checked, onChange, className = "" } = this.props;
    return (
      <div className={`checkbox-wrapper ${className}`}>
        <label className={`checkbox-container`}>
          <input type="checkbox" checked={checked} onChange={onChange} />
          <span className="checkmark">
            <i className="fa fa-check"></i>
          </span>
        </label>
        <span className="checkbox-label">{label}</span>
      </div>
    );
  }
}

export default CheckBox;
