const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const WHATSAPP_API_URL = globals.WHATSAPP_API_URL;

const geraQrcode = async (args) => {
  try {
    const { session, key } = args;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${session}/start-session`,
      {
        webhook: "",
        waitQrCode: false,
      },
      { headers },
    );

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = { geraQrcode };
