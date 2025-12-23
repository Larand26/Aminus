const enviaMensagem = async (args) => {
  window.electronApi?.enviaMensagem(args);

  const response = new Promise((resolve) => {
    window.electronApi?.onEnviaMensagem((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default enviaMensagem;
