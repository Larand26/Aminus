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
    console.log(token);

    return {
      nome: "",
      eventos: [],
      status: "Erro",
      expectativa: "",
      nomeDoRecebedor: "",
      cnpj: "",
      sucesso: false,
      mensagem: error.message,
    };
  } catch (error) {
    return {
      nome: "",
      eventos: [],
      status: "Erro",
      expectativa: "",
      nomeDoRecebedor: "",
      cnpj: "",
      sucesso: false,
      mensagem: error.message,
    };
  }
};

module.exports = {
  trackRTE,
};
