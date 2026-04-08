import { Component } from "react";
import "../../styles/components/buttons/button.css";

class Button extends Component {
  render() {
    const {
      onClick = () => {},
      text,
      icon,
      className = "",
      children,
      disabled = false,
    } = this.props;
    return (
      <button
        onClick={onClick}
        className={`custom-button ${className}`}
        disabled={disabled}
      >
        {text && <span>{text}</span>}
        {icon && <i className={icon}></i>}
        {children && children}
      </button>
    );
  }
}

export default Button;
