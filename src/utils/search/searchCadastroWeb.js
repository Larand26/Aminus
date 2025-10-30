const searchCadastroWeb = async (filtros) => {
  if (!filtros) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (Object.values(filtros).every((value) => !value)) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }

  window.electronApi?.searchCadastroProdutos(filtros);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchCadastroProdutosResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchCadastroWeb;
