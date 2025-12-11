import "../styles/pop-up.css";

const PopUp = (props) => {
  const closePopup = () => {
    if (props.setOpen) {
      props.setOpen(false);
    }
    if (props.onClose) {
      props.onClose();
    }
  };

  // Se a prop 'open' for falsa, não renderiza nada.
  if (!props.open) {
    return null;
  }

  return (
    <>
      {/* Adiciona a classe 'open-blur' quando o popup estiver aberto */}
      <div className="blur open-blur" onClick={closePopup}></div>
      <div
        className={`pop-up open-pop-up ${props.className || ""}`}
        style={{ height: props.height || "400px", width: props.width || "50%" }}
        id={props.id}
      >
        <button className="close-button" onClick={closePopup}>
          <i className="fa fa-times"></i>
        </button>
        {props.children}
      </div>
    </>
  );
};
export default PopUp;
