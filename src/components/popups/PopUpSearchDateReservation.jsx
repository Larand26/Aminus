import { Component } from "react";

import PopUp from "./PopUp";
import Button from "../buttons/Button";
import InputDate from "../inputs/InputDate";

import "../../styles/components/popups/popup-search-date-reservation.css";

import Utils from "../../utils/Utils";

class PopUpSearchDateReservation extends Component {
  render() {
    const { isOpen, onClose, onSearch, response, dateValue, onChangeDate } =
      this.props;
    return (
      <PopUp isOpen={isOpen} onClose={onClose} width={"300px"} height={"350px"}>
        <div className="popup-search-date-reservation-content">
          <h2>Pesquisar por data de reserva</h2>
          <div className="input-content">
            <InputDate
              label="Data de Reserva"
              value={dateValue}
              onChange={onChangeDate}
            />
            <Button
              icon="fa fa-search"
              onClick={onSearch}
              className="button-search"
              text="Pesquisar"
            />
          </div>
          <div className="response-content">
            <p className="response-label">Data de Reserva:</p>
            <p className="response-value">
              {Utils.formatDateTime(response) ?? ""}
            </p>
          </div>
        </div>
      </PopUp>
    );
  }
}

export default PopUpSearchDateReservation;
