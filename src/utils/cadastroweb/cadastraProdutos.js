const cadastraProdutos = async (
  itensSelecionados,
  produtos,
  nome,
  pai,
  ativosEcommerce
) => {
  // Ajusta para o formato de cadastro
  /*
    {
        ID_CODPRODUTO: 12345,
        PROD_NOME: 'Nome do Produto',
        PROD_PAI: 'SKU do Produto Pai',
        PROD_IDCOR: 1, // ID da cor
        PROD_ATIVO: true // ou false
    }
  */

  const itensParaCadastro = itensSelecionados.map((item) => {
    const originalIndex = produtos.findIndex(
      (p) => p.COD_INTERNO === item.COD_INTERNO
    );

    return {
      ID_CODPRODUTO: item.COD_INTERNO,
      PROD_NOME: nome,
      PROD_PAI: pai,
      PROD_IDCOR: item.COD_COR_ECOMMERCE,
      PROD_ATIVO: originalIndex !== -1 ? ativosEcommerce[originalIndex] : false,
    };
  });

  console.log(itensParaCadastro);

  window.electronApi?.cadastraProdutosWeb(itensParaCadastro);

  const response = new Promise((resolve) => {
    window.electronApi?.onCadastraProdutosWebResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default cadastraProdutos;
