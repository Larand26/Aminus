import { useState } from "react";

import "../styles/input-numero-label.css";

const InputNumeroLabel = (props) => {
  const [value, setValue] = useState(props.value || 0);

  return (
    <div className="input-numero-label">
      <label>{props.label || "Label"}</label>
      <div className="container">
        <button onClick={() => setValue(value - (props.adicional || 1))}>
          <i className="fas fa-minus"></i>
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={() => setValue(value + (props.adicional || 1))}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};
export default InputNumeroLabel;
