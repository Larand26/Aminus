import "../../styles/components/misc/card.css";
import { Component } from "react";

class Card extends Component {
  render() {
    const { className, onClick, icon, photo, children, photos, fallbackPhoto } =
      this.props;

    // Troca por uma imagem local quando a URL externa falha (404, sem rede...).
    const handleImageError = fallbackPhoto
      ? (e) => {
          if (!e.currentTarget.dataset.fallback) {
            e.currentTarget.dataset.fallback = "true";
            e.currentTarget.src = fallbackPhoto;
          }
        }
      : undefined;

    return (
      <div className={`card ${className || ""}`.trim()} onClick={onClick}>
        <div className="foto-card">
          {icon ? (
            <i className={icon} />
          ) : photo ? (
            <img
              src={photo}
              alt="Photo"
              loading="lazy"
              onError={handleImageError}
            />
          ) : photos ? (
            <div className={`photos ${photos.length > 1 ? "multiple" : ""}`}>
              {photos.slice(0, 4).map((p, index) => (
                <div key={index} className="photo-wrapper">
                  <img
                    className="mult-photo"
                    key={index}
                    src={p}
                    alt={`Photo ${index + 1}`}
                    loading="lazy"
                    onError={handleImageError}
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
