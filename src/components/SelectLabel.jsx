import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom"; // Importe o ReactDOM
import "../styles/inputs/select-label.css";

const SelectLabel = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(
    props.placeholder || "Selecione..."
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({}); // Estado para a posição
  const wrapperRef = useRef(null);
  const optionsRef = useRef(null); // Ref para as opções

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

  // Função para abrir/fechar e calcular a posição dinamicamente
  const toggleDropdown = () => {
    if (!isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const DROPDOWN_MAX_HEIGHT = 200; // Deve ser igual ao max-height no CSS
      const spaceBelow = window.innerHeight - rect.bottom;

      // Verifica se há espaço suficiente abaixo
      if (spaceBelow >= DROPDOWN_MAX_HEIGHT) {
        // Abre para baixo (comportamento padrão)
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
          direction: "down",
        });
      } else {
        // Abre para cima
        setDropdownPosition({
          bottom: window.innerHeight - rect.top,
          left: rect.left,
          width: rect.width,
          direction: "up",
        });
      }
    }
    setIsOpen(!isOpen);
  };

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
      // Verifica se o clique foi fora do wrapper E fora das opções
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Limpa a busca quando o select é fechado
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Filtra as opções com base no termo de busca
  const filteredOptions =
    props.options?.filter(
      (option) =>
        option &&
        typeof option.label === "string" &&
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Componente para o menu de opções que será renderizado no portal
  const DropdownOptions = () => {
    // Separa a propriedade 'direction' das propriedades de estilo
    const { direction, ...styleProps } = dropdownPosition;

    return (
      <div
        ref={optionsRef}
        className={`custom-options open ${
          direction === "up" ? "opens-up" : ""
        }`}
        style={{
          position: "fixed",
          ...styleProps, // Aplica top/bottom, left, width
          zIndex: 1001,
        }}
      >
        {props.search && (
          <input
            type="text"
            className="select-search-input"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => {
              const newTerm = e.target.value;
              setSearchTerm(newTerm);
              if (props.onSearchChange) {
                props.onSearchChange(newTerm);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus // Foca no input ao abrir
          />
        )}
        {filteredOptions.map((option, index) => (
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
    );
  };

  return (
    <div
      className={`select-label ${props.className || ""} ${
        isOpen ? "is-open" : ""
      }`}
      ref={wrapperRef}
    >
      {props.label && <label>{props.label}</label>}
      <div className="custom-select-container">
        <div className="custom-select-trigger" onClick={toggleDropdown}>
          {selectedLabel}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
        {/* Renderiza o menu de opções em um portal na raiz do body */}
        {isOpen && ReactDOM.createPortal(<DropdownOptions />, document.body)}
      </div>
      {/* Manter o select original oculto para formulários */}
      <select
        name={props.name}
        value={selectedValue}
        style={{ display: "none" }}
        readOnly
        onKeyDown={props.onKeyDown}
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
