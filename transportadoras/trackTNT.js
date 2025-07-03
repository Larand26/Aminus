const axios = require("axios");

const trackTNT = async (data) => {
  try {
    for (const nota of data) {
      const url = `https://radar.tntbrasil.com.br/radar/public/eventoNotaFiscalCliente/json/11984533000171/${nota.NUMERO_NF}.do`;
      const response = await axios.get(url);
      if (response.data && response.data.cabecalho) {
        if (response.data.cabecalho.status === "Entregue") {
          nota.STATUS = "Pedido Entregue";
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  trackTNT,
};
