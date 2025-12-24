const searchContatos = (filters) => {
  if (!filters) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (Object.values(filters).every((value) => !value)) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }

  window.electronApi?.searchContatos(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchContatosResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchContatos;
