const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const url = "https://api.frenet.com.br/shipping/quote";
const token = globals.TOKEN_FRENET; // Seu token de autenticação

const makeCotacao = async (frete) => {
  if (!frete.cep)
    return { error: "CEP do cliente é obrigatório", success: false };
  // Padrão
  const ShippingItemArrayPadrao = frete.itensPedido.map((item) => ({
    Height: item.ALTURA || 20, // Altura cm
    Length: item.COMPRIMENTO || 45, // Comprimento cm
    Quantity: Math.ceil(item.QUANTIDADE / 12) || 1, // Quantidade
    Weight:
      parseFloat((item.PESO_BRUTO * 12).toFixed(2)) === 0
        ? 5
        : parseFloat((item.PESO_BRUTO * 12).toFixed(2)), // Peso kg
    Width: item.LARGURA || 30, // Largura cm
  }));

  // 20 30 45
  const ShippingItemArray203045 = frete.itensPedido.map((item) => ({
    Height: 20, // Altura cm
    Length: 45, // Comprimento cm
    Quantity: Math.ceil(item.QUANTIDADE / 12) || 1, // Quantidade
    Weight:
      parseFloat((item.PESO_BRUTO * 12).toFixed(2)) === 0
        ? 5
        : parseFloat((item.PESO_BRUTO * 12).toFixed(2)), // Peso kg
    Width: 30, // Largura cm
  }));

  // Personalizado
  const ShippingItemArrayPersonalizado = {
    Height: frete.item.ALTURA || 20, // Altura cm
    Length: frete.item.COMPRIMENTO || 45, // Comprimento cm
    Quantity: frete.quantidade, // Quantidade
    Weight: parseFloat((frete.item.PESO_BRUTO * 12).toFixed(2)) || 1, // Peso kg
    Width: frete.item.LARGURA || 30, // Largura cm
  };

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: token,
    },
  };

  const bodyPadrao = {
    SellerCEP: "03050010", // CEP loja
    RecipientCEP: frete.cep, // CEP cliente
    ShipmentInvoiceValue: 320.685,
    ShippingServiceCode: null,
    ShippingItemArray: ShippingItemArrayPadrao,
    ShipmentInvoiceValue: frete.valor || 100,
  };

  const body203045 = {
    SellerCEP: "03050010", // CEP loja
    RecipientCEP: frete.cep, // CEP cliente
    ShipmentInvoiceValue: 320.685,
    ShippingServiceCode: null,
    ShippingItemArray: ShippingItemArray203045,
    ShipmentInvoiceValue: frete.valor || 100,
  };

  const bodyPersonalizado = {
    SellerCEP: "03050010", // CEP loja
    RecipientCEP: frete.cep, // CEP cliente
    ShipmentInvoiceValue: 320.685,
    ShippingServiceCode: null,
    ShippingItemArray: [ShippingItemArrayPersonalizado],
    ShipmentInvoiceValue: frete.valor || 100,
  };

  try {
    const responsePadrao = await axios.post(url, bodyPadrao, config);
    const response203045 = await axios.post(url, body203045, config);
    const responsePersonalizado = await axios.post(
      url,
      bodyPersonalizado,
      config,
    );

    return {
      data: {
        padrao: responsePadrao.data,
        personalizado: responsePersonalizado.data,
        "20x30x45": response203045.data,
      },
      success: true,
    };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

module.exports = { makeCotacao };
