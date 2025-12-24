const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const WHATSAPP_API_URL = globals.WHATSAPP_API_URL;
const WHATSAPP_API_KEY = globals.WHATSAPP_API_KEY;

const enviaImagem = async (args) => {
  try {
    const { imagem, contatoNumero, mensagem } = args;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_API_KEY}`,
    };
    let base64Image = imagem;
    if (!imagem.startsWith("data:image")) {
      base64Image = `data:image/jpeg;base64,${imagem}`;
    }
    const body = {
      phone: contatoNumero,
      isGroup: false,

      isNewsletter: false,
      isLid: false,
      message: mensagem,
      fileName: "foto.jpg",
      caption: "",
      base64: base64Image,
    };
    const response = await axios.post(
      `${WHATSAPP_API_URL}/lista/send-image`,
      body,
      { headers: headers }
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
    return { success: false, error: error.message };
  }
};

const enviaMensagem = async (args) => {
  try {
    const { mensagem, imagens, contatos } = args;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_API_KEY}`,
    };
    if (contatos.length === 0)
      return { success: false, error: "Nenhum contato fornecido." };

    const base64Images = imagens.map((img) => {
      if (img.startsWith("data:image")) {
        return img;
      } else {
        return `data:image/jpeg;base64,${img}`;
      }
    });

    if (base64Images.length > 0) {
      for (const contato of contatos) {
        if (!contato.CONTATO_NUMERO) continue;
        for (const base64Image of base64Images) {
          await enviaImagem({
            imagem: base64Image,
            contatoNumero: contato.CONTATO_NUMERO,
            mensagem: "",
          });
        }
      }
    }

    for (const contato of contatos) {
      if (!contato.CONTATO_NUMERO) continue;
      const body = {
        phone: contato.CONTATO_NUMERO,
        isGroup: false,
        isNewsletter: false,
        isLid: false,
        message: mensagem,
      };

      await axios.post(`${WHATSAPP_API_URL}/lista/send-message`, body, {
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
