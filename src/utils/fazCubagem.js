const fazCubagem = (itens) => {
  const cubagemTotal = itens.reduce((total, item) => {
    const altura = item.ALTURA / 100; // Convertendo para metros
    const largura = item.LARGURA / 100; // Convertendo para metros
    const comprimento = item.COMPRIMENTO / 100; // Convertendo para metros
    const quantidade = item.QUANTIDADE;
    const cubagemItem =
      altura * largura * comprimento * Math.ceil(quantidade / 12);
    return total + cubagemItem;
  }, 0);
  return cubagemTotal;
};
export default fazCubagem;
