import "../styles/pop-up.css";

const PopUp = (props) => {
  const closePopup = (id) => {
    document.querySelector(`#${id}`).classList.remove("open-pop-up");
    document.querySelector(".blur").classList.remove("open-blur");
  };
  return (
    <>
      <div className="blur" onClick={() => closePopup(props.id)}></div>
      <div
        className="pop-up"
        style={{ height: props.height || "400px", width: props.width || "50%" }}
        id={props.id}
      >
        <button className="close-button" onClick={() => closePopup(props.id)}>
          <i className="fa fa-times"></i>
        </button>
        {props.children}
      </div>
    </>
  );
};
export default PopUp;
