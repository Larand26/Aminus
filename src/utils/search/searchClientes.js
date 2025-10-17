const searchClientes = async (filters) => {
  if (!filters) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (Object.values(filters).every((value) => !value)) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  window.electronApi?.searchCliente(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchClienteResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchClientes;
