const searchTotalPedidos = (filters) => {
  if (!filters) return [];
  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchTotalPedidos(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchTotalPedidosResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchTotalPedidos;
