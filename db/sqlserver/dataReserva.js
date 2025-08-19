const conectarSql = require("../../config/database");

const getDataReserva = async (idCodProduto, idNumPedOrc, dataPesquisa) => {
  const connection = await conectarSql();

  try {
    const query = `
      SELECT TOP(1) [DATA]
      FROM [LOG]
      WHERE [DATA] >= @dataInicio
        AND [DATA] <= @dataFim
        AND [TABELA] = 'ITENSPEDIDOORCAMENTO'
        AND [ACAO] = 'Incluiu'
        AND ([ATIVIDADE] LIKE @idNumPedOrc 
        AND [ATIVIDADE] LIKE @idCodProduto)
      ORDER BY [DATA] DESC
    `;

    const result = await connection
      .request()
      .input("dataInicio", dataPesquisa[0])
      .input("dataFim", dataPesquisa[1] ? dataPesquisa[1] : new Date())
      .input("idNumPedOrc", `%${idNumPedOrc}%`)
      .input("idCodProduto", `%${idCodProduto}%`)
      .query(query);

    connection.close();
    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar dados de reserva:", error);
    connection.close();
    throw new Error(error.message || "Erro desconhecido");
  }
};

module.exports = {
  getDataReserva,
};
