const onEnviaMensagemProgresso = (callback) => {
  window.electronApi?.onEnviaMensagemProgresso((data) => {
    callback(data);
  });
};

export default onEnviaMensagemProgresso;
