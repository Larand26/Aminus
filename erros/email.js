const axios = require("axios");
const globals = require("../globals");

const enviaEmail = async (subject, conteudo, html) => {
  try {
    const response = await axios.post(
      `${globals.URL_API_EMAIL}send-email/error`,
      {
        to: "vbl09012003vbl@gmail.com",
        subject: subject,
        app: "Aminus",
        errorDetails: conteudo,
        html: html,
      },
      {
        headers: {
          Authorization: `Bearer ${globals.TOKEN_EMAIL}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar email:", error);

    throw error;
  }
};
module.exports = { enviaEmail };
