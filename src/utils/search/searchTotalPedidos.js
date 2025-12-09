const searchTotalPedidos = (filters) => {
  if (!filters) return [];
  if (Object.values(filters).every((value) => !value)) return [];

  window.electronApi?.searchTotalPedidos(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchTotalPedidosResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchTotalPedidos;
