const pegaInfosDashboardWpp = async (args) => {
  window.electronApi?.pegaInfosDashboardWpp(args);

  const response = new Promise((resolve) => {
    window.electronApi?.onPegaInfosDashboardWppResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default pegaInfosDashboardWpp;
