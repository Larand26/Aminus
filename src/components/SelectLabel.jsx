import { useState, useEffect, useRef } from "react";
import "../styles/select-label.css";

const SelectLabel = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(
    props.placeholder || "Selecione..."
  );
  const wrapperRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
    if (props.onChange) {
      // Simula o evento do select nativo
      props.onChange({ target: { name: props.name, value: option.value } });
    }
  };

  const limpaSelecao = (e) => {
    e.preventDefault();
    setSelectedValue("");
    setSelectedLabel(props.placeholder || "Selecione...");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="select-label" ref={wrapperRef}>
      <label>{props.label || "Label"}</label>
      <div className="custom-select-container">
        <div
          className="custom-select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLabel}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
        <div className={`custom-options ${isOpen ? "open" : ""}`}>
          {props.options &&
            props.options.map((option, index) => (
              <div
                key={index}
                className={`custom-option ${
                  option.value === selectedValue ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
                onContextMenu={limpaSelecao}
              >
                {option.label}
              </div>
            ))}
        </div>
      </div>
      {/* Manter o select original oculto para formulários */}
      <select
        name={props.name}
        value={selectedValue}
        style={{ display: "none" }}
        readOnly
      >
        <option value=""></option>
        {props.options &&
          props.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectLabel;
