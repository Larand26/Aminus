import "../../styles/components/misc/card.css";
import { Component } from "react";

class Card extends Component {
  render() {
    const { className, onClick, icon, photo, children } = this.props;

    return (
      <div className={`card ${className || ""}`.trim()} onClick={onClick}>
        <div className="foto-card">
          {icon ? (
            <i className={icon} />
          ) : photo ? (
            <img src={photo} alt="Photo" />
          ) : null}
        </div>
        {children}
      </div>
    );
  }
}

export default Card;
