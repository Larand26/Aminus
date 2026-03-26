import { Component, createRef } from "react";

import "../../styles/components/inputs/select.css";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchTerm: "",
    };
    this.containerRef = createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target)
    ) {
      this.setState({ isOpen: false });
    }
  };

  toggleShowOptions = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleOpenOptions = () => {
    this.setState({ isOpen: true });
  };

  handleChange = (event, option) => {
    event.stopPropagation();
    const { onChange } = this.props;

    onChange(option.value);
    this.setState({ isOpen: false, searchTerm: "" });
  };

  handleRemoveSelection = (event) => {
    event.stopPropagation();
    const { onChange } = this.props;
    onChange(null);
    this.setState({ searchTerm: "" });
  };

  handleSearchChange = (event) => {
    event.stopPropagation();
    const searchTerm = event.target.value;
    this.setState({ searchTerm, isOpen: true });
  };

  handleInputClick = (event) => {
    event.stopPropagation();
    this.setState({ isOpen: true });
  };

  handleInputToggleClick = (event) => {
    event.stopPropagation();
    this.toggleShowOptions();
  };

  handleIconClick = (event) => {
    event.stopPropagation();
    const { value } = this.props;

    if (value && !this.state.isOpen) {
      this.handleRemoveSelection(event);
      return;
    }

    this.toggleShowOptions();
  };

  render() {
    const {
      value,
      options = [],
      onChange = () => {},
      label,
      search = false,
      limit = 50,
    } = this.props;
    const { isOpen, searchTerm } = this.state;
    const selectedOption = options.find((option) => option.value === value);
    const inputLabel = selectedOption ? selectedOption.label : "";
    const normalizedTerm = searchTerm.trim().toLowerCase();
    let filteredOptions = search
      ? options.filter((option) =>
          option.label.toLowerCase().startsWith(normalizedTerm),
        )
      : options;
    filteredOptions = filteredOptions.slice(0, limit);
    const inputValue = search && isOpen ? searchTerm : inputLabel;

    return (
      <div
        className="select-container"
        onClick={this.handleOpenOptions}
        ref={this.containerRef}
      >
        {label && <label>{label}</label>}
        <div className={`select ${isOpen ? "open" : ""}`}>
          <input
            className={`select-input ${search ? "searchable" : ""}`}
            type="text"
            readOnly={!search}
            value={inputValue}
            onChange={(event) => {
              this.handleSearchChange(event);
              onChange(event.target.value);
            }}
            onClick={
              search ? this.handleInputClick : this.handleInputToggleClick
            }
          />

          <i
            className={`${value && !isOpen ? "fas fa-times" : "fas fa-chevron-down"} ${isOpen ? "open" : ""}`}
            onClick={this.handleIconClick}
          ></i>
        </div>
        <div className={`options ${isOpen ? "show" : "hidden"}`}>
          {filteredOptions.map((option, index) => (
            <div
              key={option.value ?? index}
              className={`option ${index % 2 === 0 ? "even" : "odd"}`}
              onClick={(event) => {
                this.handleChange(event, option);
              }}
            >
              <label>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Select;
