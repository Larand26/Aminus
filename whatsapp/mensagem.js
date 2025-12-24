const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const WHATSAPP_API_URL = globals.WHATSAPP_API_URL;
const WHATSAPP_API_KEY = globals.WHATSAPP_API_KEY;

const enviaMensagem = async (args) => {
  try {
    const { mensagem, imagens, contatos } = args;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_API_KEY}`,
    };
    if (contatos.length === 0)
      return { success: false, error: "Nenhum contato fornecido." };

    const base64Image =
      imagens.length > 0
        ? imagens[0].startsWith("data:image")
          ? imagens[0]
          : `data:image/jpeg;base64,${imagens[0]}`
        : null;

    /*
    {
      "phone": "5521999999999",
      "isGroup": false,
      "isNewsletter": false,
      "isLid": false,
      "filename": "file name lol",
      "caption": "caption for my file",
      "base64": "<base64> string"
    }
    */

    for (const contato of contatos) {
      if (!contato.CONTATO_NUMERO) continue;
      const body = {
        phone: contato.CONTATO_NUMERO,
        isGroup: false,
        isNewsletter: false,
        isLid: false,
        message: mensagem,
        fileName: "foto.jpg",
        caption: "Imagem enviada via API",
        base64: base64Image,
      };

      await axios.post(`${WHATSAPP_API_URL}/lista/send-image`, body, {
        headers: headers,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return { success: true, data: "Mensagens enviadas com sucesso." };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { enviaMensagem };
