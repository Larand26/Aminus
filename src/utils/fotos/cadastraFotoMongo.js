const cadastraFotoMongo = async (novaFoto) => {
  window.electronApi?.cadastraFotos(novaFoto);

  const response = new Promise((resolve) => {
    window.electronApi?.onCadastraFotosResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default cadastraFotoMongo;
