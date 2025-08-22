const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const getToken = async () => {
  try {
    const data = new URLSearchParams({
      auth_type: "DEV",
      grant_type: "password",
      password: globals.RODONAVES_PASSWORD,
      username: globals.RODONAVES_USER,
    });

    const config = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000, // 10 segundos de timeout
    };

    const res = await axios.post(
      "https://tracking-apigateway.rte.com.br/token",
      data,
      config
    );
    return `${res.data.token_type} ${res.data.access_token}`;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

const trackRTE = async (nota) => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `https://tracking-apigateway.rte.com.br/api/v1/tracking?TaxIdRegistration=11984533000171&InvoiceNumber=${nota}`,
      {
        headers: { accept: "application/json", Authorization: token },
        timeout: 15000, // 15 segundos de timeout
      }
    );

    let status = null;

    const dateEmis = new Date(result.data.EmissionDate);
    const dateExpec = new Date(
      dateEmis.setDate(
        dateEmis.getDate() + result.data.ExpectedDeliveryDays + 2
      )
    );

    if (new Date() > dateExpec) {
      status = "Atrasado";
    }
    const delivered = result.data.Events.some(
      (evento) => evento.Reason == "Sua mercadoria foi entregue!"
    );
    if (delivered) status = "Entregue";

    const eventos = result.data.Events.map((evento) => ({
      descricao: evento.Description || "",
      data: evento.OccurrenceDate || "",
    }));

    return {
      nome: result.data.RecipientDescription || "",
      eventos: eventos,
      status: status || "Em viagem",
      expectativa: dateExpec,
      cnpj: result.data.RecipientTaxIdRegistration || "",
      sucesso: false,
    };
  } catch (error) {
    return {
      nome: "",
      eventos: [],
      status: "Erro",
      expectativa: "",
      cnpj: "",
      sucesso: false,
      mensagem: error.message,
    };
  }
};

module.exports = {
  trackRTE,
};
