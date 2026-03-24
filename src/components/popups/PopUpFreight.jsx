import { Component } from "react";

import PopUp from "./PopUp";
import Table from "../table/Table";
import Loading from "../misc/Loading";

import tableOptions from "../../assets/json/table_options/freightDataOptions";

class PopUpFreight extends Component {
  ajustFreightData(data) {
    if (!data) return null;
    const ship203045 = data["20-30-45"]?.ShippingSevicesArray || [];
    const shipCustom = data["custom"]?.ShippingSevicesArray || [];
    const shipStandard = data["standard"]?.ShippingSevicesArray || [];
    console.log(data);

    // { "TRANSPORTADORA": "ServiceDescription", "PRECO": "PresentationalPrice", "PRECO[20-30-45]": "PresentationalPrice", "PRAZO_ENTREGA": "DeliveryTime", "PRAZO_ENTREGA_ORIGINAL": "OriginalDeliveryTime"}
    const ajustedData = [];

    const customService = ["JAM"];

    for (
      let i = 0;
      i < Math.max(ship203045.length, shipCustom.length, shipStandard.length);
      i++
    ) {
      const ship203045Item = ship203045[i] || {};
      const shipCustomItem = shipCustom[i] || {};
      const shipStandardItem = shipStandard[i] || {};

      ajustedData.push({
        TRANSPORTADORA: ship203045Item.ServiceDescription || "N/A",
        PRECO:
          shipStandardItem.ServiceCode &&
          customService.includes(shipStandardItem.ServiceCode)
            ? shipCustomItem.PresentationalPrice || "N/A"
            : shipStandardItem.PresentationalPrice || "N/A",
        "PRECO[20-30-45]": ship203045Item.PresentationalPrice || "N/A",
        PRAZO_ENTREGA: ship203045Item.DeliveryTime || "N/A",
        PRAZO_ENTREGA_ORIGINAL: ship203045Item.OriginalDeliveryTime || "N/A",
      });
    }

    const parsePrice = (price) => {
      if (!price || price === "N/A") return Number.POSITIVE_INFINITY;
      const numeric = Number(
        String(price)
          .replace(/[^\d,.-]/g, "")
          .replace(/\.(?=\d{3}(\D|$))/g, "")
          .replace(",", "."),
      );
      return Number.isNaN(numeric) ? Number.POSITIVE_INFINITY : numeric;
    };

    ajustedData.sort((a, b) => parsePrice(a.PRECO) - parsePrice(b.PRECO));

    return ajustedData;
  }

  render() {
    const { isOpen, onClose, data } = this.props;
    const adjustedData = this.ajustFreightData(data);
    return (
      <PopUp isOpen={isOpen} onClose={onClose}>
        <h2>Frete Calculado</h2>
        {adjustedData ? (
          <Table options={tableOptions} datas={adjustedData} search={false} />
        ) : (
          <div className="loading-container">
            <Loading />
          </div>
        )}
      </PopUp>
    );
  }
}

export default PopUpFreight;
