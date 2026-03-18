import { Component } from "react";

import "../../styles/pop-up-meu-perfil.css";

import defaultProfileImage from "../../assets/img/png/logo_png.png";
import searchTotalOrders from "../../utils/search/searchTotalPedidos";

class PopUpMeuPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalOrders: { data: [] },
    };
  }

  render() {
    const username = localStorage.getItem("username") || "";
    const role = localStorage.getItem("funcao") || "";
    const { totalOrders } = this.state;

    const completedOrders =
      totalOrders.data?.filter((order) => order.SITUACAO === "Atendido")
        .length || 0;

    const pendingOrders =
      totalOrders.data?.filter(
        (order) =>
          order.SITUACAO === "Pendente" || order.SITUACAO === "Em Alteração",
      ).length || 0;

    const canceledOrders =
      totalOrders.data?.filter((order) => order.SITUACAO === "Cancelado")
        .length || 0;

    const totalSoldValue = totalOrders.data?.reduce((acc, current) => {
      if (!current.VALOR_TOTAL) {
        return acc;
      }
      if (current.SITUACAO === "Atendido") {
        return acc + parseFloat(current.VALOR_TOTAL);
      }
      return acc;
    }, 0);

    const valueToClose = totalOrders.data?.reduce((acc, current) => {
      if (!current.VALOR_TOTAL) {
        return acc;
      }
      if (
        current.SITUACAO === "Pendente" ||
        current.SITUACAO === "Em Alteração"
      ) {
        return acc + parseFloat(current.VALOR_TOTAL);
      }
      return acc;
    }, 0);

    return (
      <div className="pop-up-meu-perfil">
        <div className="foto-perfil-container">
          <div className="foto-perfil">
            <img src={defaultProfileImage} alt="Profile Picture" />
          </div>
          <button onClick={() => {}}>
            <i className="fa-solid fa-refresh"></i>
          </button>
        </div>
        <div style={{ width: "100%" }}>
          <div>
            <p className="nome">{username}</p>
            <p className="cargo">{role}</p>
          </div>
          <div className="informacoes">
            <table>
              <thead>
                <tr>
                  <th>
                    To close <br />{" "}
                    <span>{this.formatCurrency(valueToClose)}</span>
                  </th>
                  <th>
                    Total sold <br />{" "}
                    <span>{this.formatCurrency(totalSoldValue)}</span>
                  </th>
                </tr>
                <tr className="historico-header">
                  <th colSpan="2">Order history</th>
                </tr>
              </thead>
              <tbody>
                <tr className="pedido-pendente">
                  <td colSpan="2">
                    <i className="fa-solid fa-circle-exclamation"></i> Pending:{" "}
                    {pendingOrders}
                  </td>
                </tr>
                <tr className="pedido-atendido">
                  <td colSpan="2">
                    <i className="fa-solid fa-circle-check"></i> Completed:{" "}
                    {completedOrders}
                  </td>
                </tr>
                <tr className="pedido-cancelado">
                  <td colSpan="2">
                    <i className="fa-solid fa-circle-xmark"></i> Canceled:{" "}
                    {canceledOrders}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default PopUpMeuPerfil;
