const searchNotas = (filters) => {
  if (!filters) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchNota(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchNotaResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchNotas;
