const { GoogleGenAI } = require("@google/genai");

const { TOKEN_GEMINI } = require("../globals");

const ai = new GoogleGenAI({ apiKey: TOKEN_GEMINI });

/**
 * Pega a resposta do modelo Gemini usando o SDK oficial.
 * @param {string} pergunta - A pergunta ou prompt atual para o modelo.
 * @param {Array} historico - O histórico da conversa.
 * @returns {Promise<string>} O texto da resposta do Gemini.
 */
const pegaRespostaGemini = async (pergunta, historico) => {
  try {
    const model = "gemini-2.5-flash";

    // Mapeia o histórico para o formato da API
    const contents = historico.map((item) => ({
      role: item.user === "usuário" ? "user" : "model",
      parts: [{ text: item.conteudo }],
    }));

    // Adiciona a pergunta atual ao final do histórico
    contents.push({ role: "user", parts: [{ text: pergunta }] });

    const response = await ai.models.generateContent({
      model: model,
      contents: contents, // Envia o histórico completo
      config: {
        maxOutputTokens: 4096,
      },
    });

    const respostaTexto = response.text;

    return { success: true, data: respostaTexto };
  } catch (error) {
    console.error("Erro ao obter resposta do Gemini:", error.message);
    return { success: false, error: error.message }; // Retorna o erro em vez de lançar
  }
};

module.exports = { pegaRespostaGemini };
