const enviaStatus = async (args) => {
  window.electronApi?.enviaStatus(args);

  const response = new Promise((resolve) => {
    window.electronApi?.onEnviaStatus((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default enviaStatus;
