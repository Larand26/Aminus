import "../../styles/components/misc/card.css";
import { Component } from "react";

class Card extends Component {
  render() {
    const { className, onClick, icon, photo, children, photos } = this.props;

    return (
      <div className={`card ${className || ""}`.trim()} onClick={onClick}>
        <div className="foto-card">
          {icon ? (
            <i className={icon} />
          ) : photo ? (
            <img src={photo} alt="Photo" />
          ) : photos ? (
            <div className={`photos ${photos.length > 1 ? "multiple" : ""}`}>
              {photos.slice(0, 4).map((p, index) => (
                <div key={index} className="photo-wrapper">
                  <img
                    className="mult-photo"
                    key={index}
                    src={p}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    );
  }
}

export default Card;
