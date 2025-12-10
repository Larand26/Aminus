const pegaRespostaGemini = (pergunta) => {
  window.electronApi?.pegaRespostaGemini(pergunta);

  const response = new Promise((resolve) => {
    window.electronApi?.onPegaRespostaGeminiResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default pegaRespostaGemini;
