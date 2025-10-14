const atualizaOpcoes = (novaOpcoes, opcoes) => {
  const opcoesJson = opcoes ? JSON.parse(opcoes) : [];

  if (!novaOpcoes || novaOpcoes.length === 0) {
    return { adicionadas: [], removidas: opcoesJson, modificadas: [] };
  }

  const mapaOpcoesAntigas = new Map(opcoesJson.map((op) => [op.id, op]));

  // Cria a lista final mesclando as novas opções com o estado 'checked' das antigas
  const listaFinal = novaOpcoes.map((novaOpcao) => {
    const opcaoAntiga = mapaOpcoesAntigas.get(novaOpcao.id);
    // Se a opção já existia, mantém o valor de 'checked' que ela tinha.
    // Caso contrário, usa o valor de 'checked' da nova opção (ou undefined se não existir).
    const checked = opcaoAntiga ? opcaoAntiga.checked : novaOpcao.checked;
    return {
      ...novaOpcao,
      checked: !!checked, // Garante que o valor seja sempre booleano (true/false)
    };
  });

  return listaFinal;
};
export default atualizaOpcoes;
