const criaCorNova = async (cor) => {
  window.electronApi?.createCor(cor);

  const response = new Promise((resolve) => {
    window.electronApi?.onCreateCorResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default criaCorNova;
