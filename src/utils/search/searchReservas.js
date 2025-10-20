const searchReservas = async (filters) => {
  // lida com os dados antes de enviar
  if (!filters) return [];

  if (Object.values(filters).every((value) => !value)) return [];

  window.electronApi?.searchReserva(filters);

  const response = await new Promise((resolve) => {
    window.electronApi?.onSearchReservaResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default searchReservas;
