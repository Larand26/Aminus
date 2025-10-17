const searchNotas = (filters) => {
  if (!filters) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (Object.values(filters).every((value) => !value)) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }

  window.electronApi?.searchNota(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchNotaResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchNotas;
