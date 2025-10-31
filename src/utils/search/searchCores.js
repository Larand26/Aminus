const searchCores = async (termo) => {
  window.electronApi?.getCores(termo);

  const response = new Promise((resolve) => {
    window.electronApi?.onGetCoresResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchCores;
