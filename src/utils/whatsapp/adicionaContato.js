const adicionaContato = async (args) => {
  window.electronApi?.adicionaContato(args);

  const response = new Promise((resolve) => {
    window.electronApi?.onAdicionaContato((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default adicionaContato;
