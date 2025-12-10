const pegaRespostaGemini = (pergunta, respostas) => {
  window.electronApi?.pegaRespostaGemini(pergunta, respostas);

  const response = new Promise((resolve) => {
    window.electronApi?.onPegaRespostaGeminiResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default pegaRespostaGemini;
