import "../styles/card.css";

const Card = (props) => {
  return (
    <div
      className={`card ${props.className || ""}`.trim()}
      onClick={props.onClick} // Adicionado o onClick aqui
    >
      <div className="foto-card">
        {props.icon ? (
          <i className={`fa fa-${props.icon}`} />
        ) : props.foto ? (
          <img src={props.foto} alt="Foto" />
        ) : null}
      </div>
      {props.children}
    </div>
  );
};

export default Card;
