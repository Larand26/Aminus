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

    // { "TRANSPORTADORA": "ServiceDescription", "PRECO": "ShippingPrice", "PRECO[20-30-45]": "ShippingPrice", "PRAZO_ENTREGA": "DeliveryTime", "PRAZO_ENTREGA_ORIGINAL": "OriginalDeliveryTime"}
    const ajustedData = [];

    const customService = ["JAM"];

    const getServiceKey = (item) =>
      item?.ServiceCode || item?.ServiceDescription || null;

    const ship203045Map = new Map(
      ship203045
        .map((item) => [getServiceKey(item), item])
        .filter(([key]) => Boolean(key)),
    );
    const shipCustomMap = new Map(
      shipCustom
        .map((item) => [getServiceKey(item), item])
        .filter(([key]) => Boolean(key)),
    );
    const shipStandardMap = new Map(
      shipStandard
        .map((item) => [getServiceKey(item), item])
        .filter(([key]) => Boolean(key)),
    );

    const baseList = shipStandard.length
      ? shipStandard
      : ship203045.length
        ? ship203045
        : shipCustom;

    for (let i = 0; i < baseList.length; i++) {
      const baseItem = baseList[i] || {};
      const serviceKey = getServiceKey(baseItem);
      const ship203045Item =
        (serviceKey && ship203045Map.get(serviceKey)) || ship203045[i] || {};
      const shipCustomItem =
        (serviceKey && shipCustomMap.get(serviceKey)) || shipCustom[i] || {};
      const shipStandardItem =
        (serviceKey && shipStandardMap.get(serviceKey)) ||
        shipStandard[i] ||
        {};

      ajustedData.push({
        TRANSPORTADORA:
          shipStandardItem.ServiceDescription ||
          ship203045Item.ServiceDescription ||
          shipCustomItem.ServiceDescription ||
          "N/A",
        PRECO:
          shipStandardItem.ServiceCode &&
          customService.includes(shipStandardItem.ServiceCode)
            ? shipCustomItem.ShippingPrice || "N/A"
            : shipStandardItem.ShippingPrice || "N/A",
        "PRECO[20-30-45]": ship203045Item.ShippingPrice || "N/A",
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
