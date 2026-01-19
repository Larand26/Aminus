const searchProdutos = async (filters) => {
  // lida com os dados antes de enviar
  if (!filters) return [];
  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchProduto(filters);

  const response = await new Promise((resolve) => {
    window.electronApi?.onSearchProdutoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchProdutos;
