import { useState, useEffect } from "react";

import "../styles/inputs/input-numero-label.css";

const InputNumeroLabel = (props) => {
  // inicializa com o valor numérico da prop (fallback 0)
  const inicial = Number(props.value) || 0;
  const [value, setValue] = useState(inicial);

  // sincroniza quando props.value mudar
  useEffect(() => {
    const v = Number(props.value) || 0;
    setValue(v);
  }, [props.value]);

  const step = props.adicional || 1;

  const handleChange = (newValue) => {
    const numeric = Number(newValue) || 0;
    const final = numeric < 0 ? 0 : numeric;
    setValue(final);
    if (typeof props.onChange === "function") props.onChange(final);
  };

  return (
    <div className="input-numero-label">
      <label>{props.label || "Label"}</label>
      <div className="container">
        <button type="button" onClick={() => handleChange(value - step)}>
          <i className="fas fa-minus"></i>
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={props.onKeyDown}
        />
        <button type="button" onClick={() => handleChange(value + step)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};
export default InputNumeroLabel;
