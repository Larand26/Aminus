import { Component } from "react";

import PopUp from "./PopUp";

class PopUpFreight extends Component {
  render() {
    const { isOpen, onClose, data } = this.props;
    return (
      <PopUp isOpen={isOpen} onClose={onClose}>
        <h2>Frete Calculado</h2>
      </PopUp>
    );
  }
}

export default PopUpFreight;
