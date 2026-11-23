import axios from "axios";
import FrenetConfig from "../config/FrenetConfig.js";

class FrenetService {
  static url = "https://api.frenet.com.br/shipping/quote";
  static headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    token: FrenetConfig.apiKey,
  };

  static #buildStandardShippingItems(orderItems) {
    return orderItems.map((item) => ({
      Height: item.ALTURA || 20, // Altura cm
      Length: item.COMPRIMENTO || 45, // Comprimento cm
      Quantity: Math.ceil(item.QUANTIDADE / 12) || 1, // Quantidade
      Weight:
        parseFloat((item.PESO_BRUTO * 12).toFixed(2)) === 0
          ? 5
          : parseFloat((item.PESO_BRUTO * 12).toFixed(2)), // Peso kg
      Width: item.LARGURA || 30, // Largura cm
    }));
  }

  static #buildCustomShippingItem(selectedItem, quantity) {
    return [
      {
        Height: selectedItem.ALTURA || 20, // Altura cm
        Length: selectedItem.COMPRIMENTO || 45, // Comprimento cm
        Quantity: quantity, // Quantidade
        Weight: parseFloat((selectedItem.PESO_BRUTO * 12).toFixed(2)) || 1, // Peso kg
        Width: selectedItem.LARGURA || 30, // Largura cm
      },
    ];
  }

  static #buildStandardDimensions203045Items(orderItems) {
    return orderItems.map((item) => ({
      Height: 20, // Altura cm
      Length: 45, // Comprimento cm
      Quantity: Math.ceil(item.QUANTIDADE / 12) || 1, // Quantidade
      Weight:
        parseFloat((item.PESO_BRUTO * 12).toFixed(2)) === 0
          ? 5
          : parseFloat((item.PESO_BRUTO * 12).toFixed(2)), // Peso kg
      Width: 30, // Largura cm
    }));
  }

  static #buildBraspressShippingItem(orderItems) {
    return [
      {
        Height: 20, // Altura cm
        Length: 45, // Comprimento cm
        Quantity: 1, // Quantidade
        Weight:
          orderItems.reduce((total, item) => {
            const quantity = Math.ceil(Number(item.QUANTIDADE) / 12) || 1;
            const weight = parseFloat(
              (Number(item.PESO_BRUTO) * 12).toFixed(2),
            );

            return total + (weight === 0 ? 5 : weight) * quantity;
          }, 0) || 20, // Peso kg
        Width: 30, // Largura cm
      },
    ];
  }

  static #buildRequestBodies(shipping) {
    return {
      standardBody: {
        SellerCEP: "03050010", // CEP loja
        RecipientCEP: shipping.cep, // CEP cliente
        ShipmentInvoiceValue: shipping.price || 100,
        ShippingServiceCode: null,
        ShippingItemArray: this.#buildStandardShippingItems(
          shipping.orderItems,
        ),
      },
      customBody: {
        SellerCEP: "03050010", // CEP loja
        RecipientCEP: shipping.cep, // CEP cliente
        ShipmentInvoiceValue: shipping.price || 100,
        ShippingServiceCode: null,
        ShippingItemArray: this.#buildCustomShippingItem(
          shipping.selectedItem,
          shipping.quantity,
        ),
      },
      standardDimensions203045Body: {
        SellerCEP: "03050010", // CEP loja
        RecipientCEP: shipping.cep, // CEP cliente
        ShipmentInvoiceValue: shipping.price || 100,
        ShippingServiceCode: null,
        ShippingItemArray: this.#buildStandardDimensions203045Items(
          shipping.orderItems,
        ),
      },
      braspressBody: {
        SellerCEP: "03050010", // CEP loja
        RecipientCEP: shipping.cep, // CEP cliente
        ShipmentInvoiceValue: shipping.price || 100,
        ShippingServiceCode: "BRAS_R", // Código específico para Braspress
        ShippingItemArray: this.#buildBraspressShippingItem(
          shipping.orderItems,
        ),
      },
    };
  }

  /**
   * Calcula o frete usando a API da Frenet
   * @param {Object} args { shipping: { cep, price, orderItems: [{ ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA }] } }
   * @returns
   */
  static async calculateFreight(args) {
    try {
      const { shipping } = args;
      const {
        standardBody,
        customBody,
        standardDimensions203045Body,
        braspressBody,
      } = this.#buildRequestBodies(shipping);

      const requests = {
        standard: standardBody,
        custom: customBody,
        "20-30-45": standardDimensions203045Body,
        braspress: braspressBody,
      };

      // allSettled: se uma cotação falhar, as outras continuam aparecendo
      const keys = Object.keys(requests);
      const results = await Promise.allSettled(
        keys.map((key) =>
          axios.post(this.url, requests[key], { headers: this.headers }),
        ),
      );

      const data = {};
      const errors = {};
      results.forEach((result, index) => {
        const key = keys[index];
        if (result.status === "fulfilled") {
          data[key] = result.value.data;
        } else {
          console.error(`Error calculating freight (${key}):`, result.reason);
          data[key] = null;
          errors[key] = result.reason?.message || "Erro desconhecido";
        }
      });

      if (Object.keys(errors).length === keys.length) {
        return {
          success: false,
          error: Object.values(errors).join(" | "),
          message: "Não foi possível calcular o frete.",
        };
      }

      return { success: true, data, errors };
    } catch (error) {
      console.error("Error calculating freight:", error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while calculating freight.",
      };
    }
  }
}

export default FrenetService;
