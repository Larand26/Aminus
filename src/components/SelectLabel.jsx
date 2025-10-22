import { useState, useEffect, useRef } from "react";
import "../styles/select-label.css";

const SelectLabel = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(
    props.placeholder || "Selecione..."
  );
  const wrapperRef = useRef(null);

  // Adicione este useEffect para sincronizar o estado com as props
  useEffect(() => {
    const initialValue = props.value;
    const options = props.options || [];
    const selectedOption = options.find((opt) => opt.value === initialValue);

    if (selectedOption) {
      setSelectedValue(selectedOption.value);
      setSelectedLabel(selectedOption.label);
    } else {
      // Reseta se o valor da prop não corresponder a nenhuma opção
      setSelectedValue("");
      setSelectedLabel(props.placeholder || "Selecione...");
    }
  }, [props.value, props.options, props.placeholder]);

  const handleOptionClick = (option) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange(option.value);
    }
  };

  const limpaSelecao = (e) => {
    e.preventDefault();
    setSelectedValue("");
    setSelectedLabel(props.placeholder || "Selecione...");
    if (props.onChange) {
      props.onChange("");
    }
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
    <div className={`select-label ${props.className || ""}`} ref={wrapperRef}>
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
