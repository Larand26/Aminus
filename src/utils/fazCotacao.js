const fazCotacao = async (itensPedido, itemSelecionado, pedidoSelecionado) => {
  /*
       {
        cep: "01001000", // CEP cliente
        valor: 150.75, // Valor do pedido
        itensPedido: [...], // Array de itens do pedido
        item: {...}, // Item selecionado para cotação
        quantidade: 24, // Quantidade de itens
        }
    */
  if (!itemSelecionado)
    return { error: "Item selecionado é obrigatório", success: false };
  if (!itensPedido || itensPedido.length === 0)
    return { error: "Itens do pedido são obrigatórios", success: false };
  if (!pedidoSelecionado || !pedidoSelecionado.CEP)
    return { error: "CEP do cliente é obrigatório", success: false };
  const frete = {
    cep: pedidoSelecionado.CEP,
    valor: pedidoSelecionado.VALOR_TOTAL,
    itensPedido: itensPedido,
    item: itemSelecionado,
    quantidade: pedidoSelecionado.QUANTIDADE_MERCADORIA,
  };

  window.electronApi?.makeCotacao(frete);

  const response = new Promise((resolve) => {
    window.electronApi?.onMakeCotacaoResponse((arg) => {
      if (arg.success) {
        const result = arg.data.padrao.ShippingSevicesArray.map(
          (item, index) => ({
            NOME_TRANSPORTADORA: item.ServiceDescription,
            PRECO_PADRAO: item.PresentationalPrice,
            PRECO_PERSONALIZADO:
              arg.data.personalizado.ShippingSevicesArray[index]
                .PresentationalPrice,
            TEMPO_ENTREGA: `${item.DeliveryTime} - ${
              parseInt(item.DeliveryTime) + 2
            }`,
          })
        );
        resolve({
          success: true,
          data: result.sort((a, b) => a.PRECO_PADRAO - b.PRECO_PADRAO),
        });
      } else {
        resolve(arg);
      }
    });
  });

  return response;
};

export default fazCotacao;
