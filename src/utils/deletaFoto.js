const deletaFoto = async (fotoId) => {
  if (!fotoId) return;

  window.electronApi?.deleteFoto(fotoId);

  const response = new Promise((resolve) => {
    window.electronApi?.onDeleteFotoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default deletaFoto;
