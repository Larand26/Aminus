import { Component } from "react";

import PopUp from "./PopUp";
import Button from "../buttons/Button";

import defaltImg from "../../assets/img/png/logo_png.png";

import "../../styles/components/popups/popup-profile.css";

class PopUpProfile extends Component {
  render() {
    const { isOpen, onClose, infos } = this.props;
    return (
      <PopUp isOpen={isOpen} onClose={onClose}>
        <div className="popup-profile-content">
          <div className="profile-photo-container">
            <img
              src={defaltImg}
              alt="Foto de Perfil"
              className="profile-photo"
            />
            <div className="buttons-container">
              <Button className="button-edit-profile" text="Mudar Foto" />
              <Button className="button-logout" text="Ver pedidos" />
            </div>
          </div>
          <div className="profile-info">
            <p className="name">JOAO VITOR</p>
            <p className="function">VENDEDOR</p>
            <div className="order-infos-container">
              <div className="total-container">
                <div className="pending-container stat-box">
                  <p className="stat-label">A fechar</p>
                  <p className="stat-value">
                    {infos?.totalpending ?? "R$0,00"}
                  </p>
                </div>
                <div className="sold-container stat-box">
                  <p className="stat-label">Total vendido</p>
                  <p className="stat-value">{infos?.totalSold ?? "R$0,00"}</p>
                </div>
              </div>
              <div className="orders-history-title">Histórico de pedidos</div>
              <div className="orders-container">
                <div className="order order-pending">
                  <p>
                    <span className="order-icon">
                      <i class="fa-solid fa-exclamation"></i>
                    </span>
                    Pendente: {infos?.totalOrdersPending ?? 0}
                  </p>
                </div>
                <div className="order order-completed">
                  <p>
                    <span className="order-icon">
                      <i class="fa-solid fa-check"></i>
                    </span>
                    Completo: {infos?.totalOrdersSold ?? 0}
                  </p>
                </div>
                <div className="order order-cancelled">
                  <p>
                    <span className="order-icon">
                      <i class="fa-solid fa-times"></i>
                    </span>
                    Cancelado: {infos?.totalOrdersCancelled ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopUp>
    );
  }
}

export default PopUpProfile;
