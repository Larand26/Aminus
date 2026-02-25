const axios = require("axios");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));
// Renomeamos para garantir que não conflite com a global FormData do Node
const FormDataNode = require("form-data");
const { Readable } = require("stream");

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
      await new Promise((resolve) => setTimeout(resolve, 500));
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

    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true, data: "Mensagens enviadas com sucesso." };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false, error: error.message };
  }
};

const enviaStatus = async (args) => {
  try {
    const { texto, imagens, videos, key, session } = args;
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

    if (imagens && imagens.length > 0) {
      const imgsPathsResult = await axios.post(
        "https://servidor-para-subir-fotos-production.up.railway.app/upload",
        { images: base64Imagens },
      );
      console.log(imgsPathsResult);

      if (
        !imgsPathsResult.data ||
        !imgsPathsResult.data.urls ||
        imgsPathsResult.data.urls.length === 0
      ) {
        return {
          success: false,
          error: "Erro ao subir imagens para o servidor.",
        };
      }

      try {
        for (const urls of imgsPathsResult.data.urls) {
          const body = {
            path: urls,
          };
          const response = await axios.post(
            `${WHATSAPP_API_URL}/${session}/send-image-storie`,
            body,
            {
              headers: headers,
            },
          );
          console.log(response.data);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error("Erro ao processar imagens:", error);
        return { success: false, error: error.message };
      }
    }

    console.log("Videos", videos);
    if (videos && videos.length > 0) {
      const videoObj = videos[0];
      const formData = new FormDataNode(); // Usando a biblioteca form-data explicitamente

      formData.append("name", "testando");
      formData.append("typeVideo", "mov");

      // 1. Converter ArrayBuffer para Buffer do Node
      const bufferNode = Buffer.from(videoObj.buffer);

      // 2. Anexar ao FormData
      // A biblioteca 'form-data' aceita Buffer diretamente com opções
      formData.append("buffer", bufferNode, {
        filename: videoObj.file.name || "video.mov",
        contentType: videoObj.file.type || "video/quicktime",
        knownLength: bufferNode.length,
      });

      console.log("Enviando vídeo, tamanho:", bufferNode.length);

      try {
        const responseTempLink = await axios.post(
          "https://temp-link-production.up.railway.app/api/video/buffer",
          formData,
          {
            headers: {
              ...formData.getHeaders(), // Isso só funciona com a lib 'form-data'
              Authorization: `Bearer ${key}`, // Se precisar de auth
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        );

        if (!responseTempLink.data || !responseTempLink.data.success) {
          return {
            success: false,
            error: "Erro ao gerar link temporário para o vídeo.",
          };
        }
        const videoUrl = responseTempLink.data.url;

        const body = {
          path: videoUrl,
        };
        const response = await axios.post(
          `${WHATSAPP_API_URL}/${session}/send-video-storie`,
          body,
          {
            headers: headers,
          },
        );
        console.log(response.data);
        return { success: true, data: "Status enviado com sucesso." };
      } catch (error) {
        console.error("Erro na requisição:", error.message);
        if (error.response) console.error("Detalhes:", error.response.data);
      }
    }

    return { success: true, data: "Status enviado com sucesso." };
  } catch (error) {
    console.log("Erro ao enviar status:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { enviaMensagem, enviaImagens, enviaStatus };
