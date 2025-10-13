const searchProdutos = async (produtos) => {
  // lida com os dados antes de enviar
  if (!produtos) return [];

  if (Object.values(produtos).every((value) => !value)) return [];

  window.electronApi?.searchProduto(produtos);

  const response = await new Promise((resolve) => {
    window.electronApi?.onSearchProdutoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default searchProdutos;
