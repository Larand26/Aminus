import "../../styles/components/misc/card.css";
import { Component } from "react";

class Card extends Component {
  render() {
    const { className, onClick, icon, foto, children } = this.props;

    return (
      <div className={`card ${className || ""}`.trim()} onClick={onClick}>
        <div className="foto-card">
          {icon ? (
            <i className={icon} />
          ) : foto ? (
            <img src={foto} alt="Photo" />
          ) : null}
        </div>
        {children}
      </div>
    );
  }
}

export default Card;
