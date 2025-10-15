const getItensPedido = async (pedido) => {
  if (!pedido) return { data: [], error: "Pedido Inválido" };

  window.electronApi?.getItensPedido(pedido);
};
export default getItensPedido;
