class Frenet {
  static async calculateFreight(args) {
    const { token, selectedOrderData, selectItemOrder, selectedOrder } = args;
    try {
      /**
       *  { token, shipping: { cep, price, orderItems: [{ ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA }], selectedItem: { ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA } } }
       */
      const price = selectedOrderData.reduce(
        (total, item) => total + item.PRECO * item.QUANTIDADE,
        0,
      );
      const quantity = Math.ceil(
        selectedOrderData.reduce(
          (total, item) => total + item.QUANTIDADE / 12,
          0,
        ),
      );
      const shipping = {
        cep: selectedOrder.CEP,
        price,
        quantity,
        orderItems: selectedOrderData.map((item) => ({
          ALTURA: item.ALTURA,
          COMPRIMENTO: item.COMPRIMENTO,
          QUANTIDADE: item.QUANTIDADE,
          PESO_BRUTO: item.PESO_BRUTO,
          LARGURA: item.LARGURA,
        })),
        selectedItem: {
          ALTURA: selectItemOrder[0].ALTURA,
          COMPRIMENTO: selectItemOrder[0].COMPRIMENTO,
          PESO_BRUTO: selectItemOrder[0].PESO_BRUTO,
          LARGURA: selectItemOrder[0].LARGURA,
        },
      };

      return await window.api.calculateFreight({ token, shipping });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  static ajustFreightData(data) {
    if (!data) return null;

    const ship203045 = data["20-30-45"]?.ShippingSevicesArray || [];
    const shipCustom = data["custom"]?.ShippingSevicesArray || [];
    const shipStandard = data["standard"]?.ShippingSevicesArray || [];
    const shipBraspress = data["braspress"]?.ShippingSevicesArray || [];

    // { "SHIP": "ServiceDescription", "PRICE": "ShippingPrice", "PRICE[20-30-45]": "ShippingPrice", "DELIVERY_TIME": "DeliveryTime", "ORIGINAL_DELIVERY_TIME": "OriginalDeliveryTime"}

    if (ship203045.some((item) => item.ServiceCode === "BRAS_R")) {
      if (shipBraspress.length > 0) {
        // Acha a posição do item de Braspress em ship203045
        const braspressIndex = ship203045.findIndex(
          (item) => item.ServiceCode === "BRAS_R",
        );
        if (braspressIndex !== -1) {
          ship203045[braspressIndex] = shipBraspress[0];
        }
      }
    }

    const customService = ["JAM"];

    if (ship203045.some((item) => customService.includes(item.ServiceCode))) {
      if (
        shipCustom.length > 0 &&
        shipCustom.some((item) => customService.includes(item.ServiceCode))
      ) {
        // Acha a posição do item custom em ship203045
        const customIndex = ship203045.findIndex((item) =>
          customService.includes(item.ServiceCode),
        );
        if (customIndex !== -1) {
          const customItem = shipCustom.find((item) =>
            customService.includes(item.ServiceCode),
          );
          if (customItem) {
            ship203045[customIndex] = customItem;
          }
        }
      }
    }

    const toNumber = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    return ship203045
      .filter((item) => !item.Error)
      .map((item) => {
        const standardItem = shipStandard.find(
          (standard) => standard.ServiceCode === item.ServiceCode,
        );

        return {
          SHIP:
            item.ServiceDescription || item.Carrier || item.ServiceCode || "",
          PRICE: toNumber(standardItem?.ShippingPrice ?? item.ShippingPrice),
          ORIGINAL_PRICE: toNumber(
            standardItem?.OriginalShippingPrice ??
              standardItem?.ShippingPrice ??
              item.OriginalShippingPrice ??
              item.ShippingPrice,
          ),
          "PRICE[20-30-45]": toNumber(item.ShippingPrice),
          "ORIGINAL_PRICE[20-30-45]": toNumber(
            item.OriginalShippingPrice || item.ShippingPrice,
          ),
          DELIVERY_TIME: item.DeliveryTime || "",
          ORIGINAL_DELIVERY_TIME:
            item.OriginalDeliveryTime || item.DeliveryTime || "",
        };
      });
  }
}

export default Frenet;
