import { Component } from "react";

import "../../styles/components/inputs/input-textarea.css";

class TextArea extends Component {
  render() {
    const { value, onChange, placeholder } = this.props;
    return (
      <textarea
        className="input-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }
}

export default TextArea;
