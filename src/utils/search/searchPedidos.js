const searchPedidos = (filters) => {
  if (!filters) return [];
  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchPedido(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchPedidoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchPedidos;
