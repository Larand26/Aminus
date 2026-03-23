class Frenet {
  static async calculateFreight(args) {
    const { token, selectedOrderData, selectItemOrder, selectedOrder } = args;
    try {
      /**
       *  { token, shipping: { cep, price, orderItems: [{ ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA }], selectedItem: { ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA } } }
       */
      const price = selectItemOrder.reduce(
        (total, item) => total + item.PRECO * item.QUANTIDADE,
        0,
      );
      const quantity = Math.ceil(
        selectItemOrder.reduce(
          (total, item) => total + item.QUANTIDADE / 12,
          0,
        ),
      );
      const shipping = {
        cep: selectedOrderData[0].CEP,
        price,
        quantity,
        orderItems: selectedOrderData.map((item) => ({
          ALTURA: item.ALTURA,
          COMPRIMENTO: item.COMPRIMENTO,
          QUANTIDADE: item.QUANTIDADE,
          PESO_BRUTO: item.PESO_BRUTO,
          LARGURA: item.LARGURA,
        })),
        selectedItem: {
          ALTURA: selectItemOrder.ALTURA,
          COMPRIMENTO: selectItemOrder.COMPRIMENTO,
          QUANTIDADE: selectItemOrder.QUANTIDADE,
          PESO_BRUTO: selectItemOrder.PESO_BRUTO,
          LARGURA: selectItemOrder.LARGURA,
        },
      };
      console.log({ token, shipping });

      return await window.api.calculateFreight({ token, shipping });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }
}

export default Frenet;
