const editaContato = async (contato) => {
  window.electronApi?.editaContato(contato);

  const response = new Promise((resolve) => {
    window.electronApi?.onEditaContatoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default editaContato;
