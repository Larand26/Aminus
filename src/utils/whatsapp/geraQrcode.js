const geraQrcode = async (token) => {
  window.electronApi?.geraQrcode(token);

  const response = new Promise((resolve) => {
    window.electronApi?.onGeraQrcodeResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default geraQrcode;
