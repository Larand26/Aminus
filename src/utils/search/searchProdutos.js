const searchProdutos = async (produtos) => {
  // lida com os dados antes de enviar
  if (!produtos) return [];

  if (
    Object.entries(filters)
      .filter(([key]) => key !== "token")
      .every(([, value]) => !value)
  )
    return { success: false, error: "Nenhum filtro válido fornecido." };

  window.electronApi?.searchProduto(produtos);

  const response = await new Promise((resolve) => {
    window.electronApi?.onSearchProdutoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchProdutos;
