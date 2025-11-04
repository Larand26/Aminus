const atualizaItemSelecionado = (itensSelecionado) => {
  if (!itensSelecionado) return;

  const [fabrica, marca, genero, tipo, colecao] =
    itensSelecionado.GRUPO_DESCRICAO.split(", ");

  const quantidades = itensSelecionado.QUANTIDADES.split(",");
  const numeros = itensSelecionado.NUMEROS.split(",");

  const grade = numeros.map((numero, index) => ({
    NUMERO: numero.trim(),
    QUANTIDADE: parseInt(quantidades[index].trim(), 10) || 0,
  }));

  console.log("Item selecionado atualizado:", itensSelecionado);
};

export default atualizaItemSelecionado;
