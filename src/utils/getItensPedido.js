const getItensPedido = async (pedido) => {
  if (!pedido) return { data: [], error: "Pedido Inválido" };
  window.electronApi?.getItensPedido(pedido);

  const response = new Promise((resolve) => {
    window.electronApi?.onGetItensPedidoResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default getItensPedido;
