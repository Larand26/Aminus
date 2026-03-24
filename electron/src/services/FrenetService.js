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
      const { standardBody, customBody, standardDimensions203045Body } =
        this.#buildRequestBodies(shipping);
      console.log(customBody);
      const [standardResponse, customResponse, response203045] =
        await Promise.all([
          axios.post(this.url, standardBody, { headers: this.headers }),
          axios.post(this.url, customBody, {
            headers: this.headers,
          }),
          axios.post(this.url, standardDimensions203045Body, {
            headers: this.headers,
          }),
        ]);
      return {
        success: true,
        data: {
          standard: standardResponse.data,
          custom: customResponse.data,
          "20-30-45": response203045.data,
        },
      };
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
