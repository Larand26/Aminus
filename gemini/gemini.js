const { GoogleGenAI } = require("@google/genai");

const { TOKEN_GEMINI } = require("../globals");

const ai = new GoogleGenAI({ apiKey: TOKEN_GEMINI });

/**
 * Pega a resposta do modelo Gemini usando o SDK oficial.
 * @param {string} pergunta - A pergunta ou prompt para o modelo.
 * @returns {Promise<string>} O texto da resposta do Gemini.
 */
const pegaRespostaGemini = async (pergunta) => {
  try {
    const model = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: pergunta }] }],
      config: {
        maxOutputTokens: 1024,
      },
    });

    const respostaTexto = response.text;

    return { success: true, data: respostaTexto };
  } catch (error) {
    console.error("Erro ao obter resposta do Gemini:", error.message);
    throw { success: false, error: error.message };
  }
};

module.exports = { pegaRespostaGemini };
