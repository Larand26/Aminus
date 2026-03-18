import { Component } from "react";

import "../styles/pop-up.css";

class PopUp extends Component {
  closePopup = () => {
    const { setOpen, onClose } = this.props;

    if (setOpen) {
      setOpen(false);
    }

    if (onClose) {
      onClose();
    }
  };

  render() {
    const { open, className, height, width, id, children } = this.props;

    // If the popup is closed, do not render anything.
    if (!open) {
      return null;
    }

    return (
      <>
        {/* Adds blur overlay while popup is open */}
        <div className="blur open-blur" onClick={this.closePopup}></div>
        <div
          className={`pop-up open-pop-up ${className || ""}`}
          style={{ height: height || "400px", width: width || "50%" }}
          id={id}
        >
          <button className="close-button" onClick={this.closePopup}>
            <i className="fa fa-times"></i>
          </button>
          {children}
        </div>
      </>
    );
  }
}

export default PopUp;
