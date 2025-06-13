const conectarSql = require("./database");

const getDataReserva = async (idCodProduto, idNumPedOrc) => {
  const connection = await conectarSql();
  try {
    const query = `
    SELECT TOP(1) [DATA]
    FROM [LOG]
    WHERE [DATA] >= '2025-01-01'
    AND [TABELA] = 'ITENSPEDIDOORCAMENTO'
    AND [ACAO] = 'Incluiu'
    AND ([ATIVIDADE] LIKE '%${idNumPedOrc}%' 
    AND [ATIVIDADE] LIKE '%${idCodProduto}%')
    ORDER BY [DATA] DESC
`;
    const result = await connection.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar dados de reserva:", error);
    throw new Error(error.message || "Erro desconhecido");
  }
};

module.exports = {
  getDataReserva,
};
