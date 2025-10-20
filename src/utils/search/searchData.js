const searchData = async (filters) => {
  if (!filters) return { data: [], success: false };
  if (Object.values(filters).every((value) => !value))
    return { data: [], success: false };

  window.electronApi?.getDataReserva(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onGetDataReservaResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default searchData;
