const searchTotalPedidos = (filters) => {
  if (!filters) return [];
  if (Object.values(filters).every((value) => !value)) return [];

<<<<<<< HEAD
  window.electronApi?.searchTotalPedidos(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchTotalPedidosResponse((arg) => {
=======
  window.electronApi?.searchTotalPedido(filters);
  const response = new Promise((resolve) => {
    window.electronApi?.onSearchTotalPedidoResponse((arg) => {
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587
      resolve(arg);
    });
  });

  return response;
};

export default searchTotalPedidos;
