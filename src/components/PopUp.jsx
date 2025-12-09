import React from "react";
import "../styles/pop-up.css";

const PopUp = (props) => {
  const { isOpen, onClose, id, children } = props;

  const closePopup = () => {
    if (onClose) {
      onClose();
    }
  };

  // Clona o elemento filho para passar a propriedade isOpen
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Garante que a prop isOpen seja passada corretamente
      return React.cloneElement(child, { ...child.props, isOpen });
    }
    return child;
  });

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="blur open-blur" onClick={closePopup}></div>
      <div
        className="pop-up open-pop-up"
        style={{ height: props.height || "400px", width: props.width || "50%" }}
        id={id}
      >
        <button className="close-button" onClick={closePopup}>
          <i className="fa fa-times"></i>
        </button>
        {childrenWithProps}
      </div>
    </>
  );
};
export default PopUp;
