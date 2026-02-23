const verificaQrCodeConectado = async (token) => {
  window.electronApi?.verificaQrCodeConectado(token);

  const response = new Promise((resolve) => {
    window.electronApi?.onVerificaQrCodeConectadoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default verificaQrCodeConectado;
