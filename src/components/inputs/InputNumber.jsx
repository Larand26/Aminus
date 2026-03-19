import { Component } from "react";

import "../../styles/components/inputs/input-number.css";

class InputNumber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: Number(props.value) || 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      const v = Number(this.props.value) || 0;
      if (v !== this.state.value) {
        this.setState({ value: v });
      }
    }
  }

  handleChange(newValue) {
    const numeric = Number(newValue) || 0;
    const final = numeric < 0 ? 0 : numeric;

    this.setState({ value: final });
    if (typeof this.props.onChange === "function") {
      this.props.onChange(final);
    }
  }

  render() {
    const { label, adicional, onKeyDown } = this.props;
    const { value } = this.state;
    const step = adicional || 1;

    return (
      <div className="input-numero-label">
        <label>{label || "Label"}</label>
        <div className="container">
          <button type="button" onClick={() => this.handleChange(value - step)}>
            <i className="fas fa-minus"></i>
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => this.handleChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="button" onClick={() => this.handleChange(value + step)}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default InputNumber;
