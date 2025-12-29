const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const WHATSAPP_API_URL = globals.WHATSAPP_API_URL;

const enviaImagens = async (args) => {
  try {
    const { mensagem, imagens, contatoNumero, key, session } = args;
    if (!imagens || imagens.length === 0) {
      return { success: false, error: "Nenhuma imagem fornecida." };
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    };
    let base64Imagens = imagens.map((img) => {
      if (!img.startsWith("data:image")) {
        return `data:image/jpeg;base64,${img}`;
      }
      return img;
    });

    for (const base64Image of base64Imagens) {
      const body = {
        phone: contatoNumero,
        isGroup: false,
        isNewsletter: false,
        isLid: false,
        message: "",
        fileName: "foto.jpg",
        caption: "",
        base64: base64Image,
      };

      await axios.post(`${WHATSAPP_API_URL}/${session}/send-image`, body, {
        headers: headers,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return { success: true, data: "Imagens enviadas com sucesso." };
  } catch (error) {
    console.error("Erro ao enviar imagens:", error);
    return { success: false, error: error.message };
  }
};

const enviaMensagem = async (args) => {
  try {
    const { mensagem, imagens, contatoNumero, key, session } = args;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    };
    const body = {
      phone: contatoNumero,
      isGroup: false,
      isNewsletter: false,
      isLid: false,
      message: mensagem,
    };

    await axios.post(`${WHATSAPP_API_URL}/${session}/send-message`, body, {
      headers: headers,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { success: true, data: "Mensagens enviadas com sucesso." };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { enviaMensagem, enviaImagens };
