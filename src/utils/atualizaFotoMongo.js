const atualizaFotoMongo = async (novaFoto) => {
  window.electronApi?.updateFoto(novaFoto);

  const response = new Promise((resolve) => {
    window.electronApi?.onUpdateFotoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default atualizaFotoMongo;
