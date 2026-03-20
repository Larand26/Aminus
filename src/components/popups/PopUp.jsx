import { Component } from "react";

import "../../styles/components/popups/pop-up.css";
import Button from "../buttons/Button";

class PopUp extends Component {
  closePopup = (e) => {
    e.stopPropagation();
    const { onClose } = this.props;
    if (onClose) onClose();
  };
  render() {
    const { isOpen, children, width, height } = this.props;

    return (
      <div
        className={`popup ${isOpen ? "show" : "hidden"}`}
        style={{ width, height }}
      >
        <Button
          onClick={this.closePopup}
          className="button-close"
          icon="fa fa-times"
        />
        <div className="popup-content">{children}</div>
      </div>
    );
  }
}

export default PopUp;
