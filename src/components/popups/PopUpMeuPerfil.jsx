import { useState } from "react";

import "../../styles/pop-up-meu-perfil.css";

import imgPadrao from "../../assets/img/png/logo_png.png";
import searchTotalPedidos from "../../utils/search/searchTotalPedidos";

const PopUpMeuPerfil = () => {
  const [userData, setUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : {}
  );
  const [totalPedidos, setTotalPedidos] = useState({ data: [] });

  const handleSearchTotalPedidos = async () => {
    try {
      const response = await searchTotalPedidos({
        nomeVendedor: userData.NOME,
      });
      console.log(response);
      setTotalPedidos(response);
    } catch (error) {
      console.error("Erro ao buscar total de pedidos:", error);
    }
  };

  const pedidosAtendidos =
    totalPedidos.data?.filter((p) => p.SITUACAO === "Atendido").length || 0;

  const pedidosPendentes =
    totalPedidos.data?.filter(
      (p) => p.SITUACAO === "Pendente" || p.SITUACAO === "Em Alteração"
    ).length || 0;

  const pedidosCancelados =
    totalPedidos.data?.filter((p) => p.SITUACAO === "Cancelado").length || 0;

  const valorTotalPedidos = totalPedidos.data?.reduce((acc, curr) => {
    if (!curr.VALOR_TOTAL) {
      return acc;
    }
    if (curr.SITUACAO === "Atendido") {
      return acc + parseFloat(curr.VALOR_TOTAL);
    }
    return acc;
  }, 0);

  const valorAFechar = totalPedidos.data?.reduce((acc, curr) => {
    if (!curr.VALOR_TOTAL) {
      return acc;
    }
    if (curr.SITUACAO === "Pendente" || curr.SITUACAO === "Em Alteração") {
      return acc + parseFloat(curr.VALOR_TOTAL);
    }
    return acc;
  }, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="pop-up-meu-perfil">
      <div className="foto-perfil-container">
        <div className="foto-perfil">
          <img src={imgPadrao} alt="Foto de Perfil" />
        </div>
        <button onClick={handleSearchTotalPedidos}>
          <i className="fa-solid fa-refresh"></i>
        </button>
      </div>
      <div style={{ width: "100%" }}>
        <div>
          <p className="nome">{userData.NOME}</p>
          <p className="cargo">{userData.DESCRICAO}</p>
        </div>
        <div className="informacoes">
          <table>
            <thead>
              <tr>
                <th>
                  A fechar <br /> <span>{formatCurrency(valorAFechar)}</span>
                </th>
                <th>
                  Total vendido <br />{" "}
                  <span>{formatCurrency(valorTotalPedidos)}</span>
                </th>
              </tr>
              <tr className="historico-header">
                <th colSpan="2">Histórico de pedidos</th>
              </tr>
            </thead>
            <tbody>
              <tr className="pedido-pendente">
                <td colSpan="2">
                  <i className="fa-solid fa-circle-exclamation"></i> Pendente:{" "}
                  {pedidosPendentes}
                </td>
              </tr>
              <tr className="pedido-atendido">
                <td colSpan="2">
                  <i className="fa-solid fa-circle-check"></i> Completo:{" "}
                  {pedidosAtendidos}
                </td>
              </tr>
              <tr className="pedido-cancelado">
                <td colSpan="2">
                  <i className="fa-solid fa-circle-xmark"></i> Cancelado:{" "}
                  {pedidosCancelados}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PopUpMeuPerfil;
