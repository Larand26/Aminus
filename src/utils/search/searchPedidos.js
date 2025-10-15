const searchPedidos = (filters) => {
  if (!filters) return [];
  if (Object.values(filters).every((value) => !value)) return [];

  window.electronApi?.searchPedido(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchPedidoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchPedidos;
