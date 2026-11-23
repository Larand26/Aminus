import { Component } from "react";

import PopUp from "./PopUp";
import Loading from "../misc/Loading";

import FrenetUtils from "../../utils/Frenet";
import Utils from "../../utils/Utils";

import "../../styles/components/popups/popup-freight.css";

const formatDays = (days) => {
  if (days == null) return "—";
  return `${days} ${days === 1 ? "dia útil" : "dias úteis"}`;
};

/** Valor com o preço "de" riscado quando a Frenet aplicou desconto */
const Price = ({ quote }) => {
  if (!quote || quote.price == null) {
    return <span className="freight-muted">—</span>;
  }
  const hasDiscount =
    quote.originalPrice != null && quote.originalPrice > quote.price;
  return (
    <span className="freight-price">
      {hasDiscount && (
        <s className="freight-price-original">
          {Utils.formatCurrency(quote.originalPrice)}
        </s>
      )}
      {Utils.formatCurrency(quote.price)}
    </span>
  );
};

class PopUpFreight extends Component {
  renderRow(row) {
    if (!row.available) {
      return (
        <tr key={row.code} className="freight-row unavailable">
          <td>
            <span className="freight-name">{row.name}</span>
            {row.rule && (
              <span className="freight-badge">{row.rule.label}</span>
            )}
          </td>
          <td colSpan={2} className="freight-error" title={row.errorMessage}>
            Indisponível · {row.errorMessage}
          </td>
        </tr>
      );
    }

    return (
      <tr
        key={row.code}
        className={`freight-row ${row.cheapest ? "cheapest" : ""}`}
      >
        <td>
          <span className="freight-name">{row.name}</span>
          {row.rule && (
            <span className="freight-badge" title={row.rule.description}>
              {row.rule.label}
            </span>
          )}
        </td>
        <td className="freight-final">
          <Price quote={row.final} />
          {row.cheapest && <span className="freight-tag">Mais barato</span>}
        </td>
        <td className="freight-time">
          {formatDays(row.final.deliveryTime)}
          {row.fastest && <span className="freight-tag">Mais rápido</span>}
        </td>
      </tr>
    );
  }

  renderContent() {
    const { data, error, warnings } = this.props;

    if (error) {
      return <div className="freight-alert error">{error}</div>;
    }

    const rows = FrenetUtils.buildFreightRows(data);
    if (!rows) {
      return (
        <div className="loading-container">
          <Loading />
        </div>
      );
    }

    const availableCount = rows.filter((row) => row.available).length;
    const failedQuotes = Object.keys(warnings || {});

    return (
      <>
        <p className="freight-summary">
          {availableCount} de {rows.length} transportadoras com cotação ·
          ordenado do menor para o maior valor
        </p>
        {failedQuotes.length > 0 && (
          <div className="freight-alert">
            Algumas cotações falharam ({failedQuotes.join(", ")}). Os valores
            delas podem estar faltando.
          </div>
        )}
        <div className="freight-table-wrapper">
          <table className="freight-table">
            <thead>
              <tr>
                <th>Transportadora</th>
                <th>Preço</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>{rows.map((row) => this.renderRow(row))}</tbody>
          </table>
        </div>
        <p className="freight-legend">
          Braspress e Rodonaves: peso real (caixa 20×30×45). Demais
          transportadoras: peso cubado (medidas do produto). Braspress e JAM têm
          cálculo específico (passe o mouse na etiqueta).
        </p>
      </>
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <PopUp isOpen={isOpen} onClose={onClose} width="760px" height="560px">
        <div className="popup-freight">
          <h2>Frete Calculado</h2>
          {this.renderContent()}
        </div>
      </PopUp>
    );
  }
}

export default PopUpFreight;
