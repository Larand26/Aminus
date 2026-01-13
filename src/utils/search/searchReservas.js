const searchReservas = async (filters) => {
  // lida com os dados antes de enviar
  if (!filters) return [];

  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchReserva(filters);

  const response = await new Promise((resolve) => {
    window.electronApi?.onSearchReservaResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default searchReservas;
