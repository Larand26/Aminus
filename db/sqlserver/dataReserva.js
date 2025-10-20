const conectarSql = require("../../config/database");
const sql = require("mssql"); // 1. Importe o pacote mssql

const getDataReserva = async (arg) => {
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

    // 2. Use uma data muito antiga se a data de início for nula
    const dataInicio = arg.dataPesquisa[0] || new Date("1970-01-01");
    const dataFim = arg.dataPesquisa[1] || new Date();

    const result = await connection
      .request()
      // 3. Especifique os tipos de dados para os parâmetros
      .input("dataInicio", sql.DateTime, dataInicio)
      .input("dataFim", sql.DateTime, dataFim)
      .input("idNumPedOrc", sql.VarChar, `%${String(arg.numPedido)}%`)
      .input("idCodProduto", sql.VarChar, `%${arg.codInterno}%`)
      .query(query);

    connection.close();
    return { data: result.recordset, success: true };
  } catch (error) {
    console.error("Erro ao buscar dados de reserva:", error);
    connection.close();
    return { data: [], success: false };
  }
};

module.exports = {
  getDataReserva,
};
