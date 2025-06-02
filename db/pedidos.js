const conectarSql = require("./database");

const searchPedido = async (pedido) => {
  const connection = await conectarSql();
  try {
    const clienteResult = await connection
      .request()
      .query(
        `SELECT TOP (1) [ID_CODENTIDADE] FROM [ENTIDADES] WHERE [ID_CODFILIAIS] = '1' AND [ENTI_CNPJCPF] = '${pedido.cnpj}'`
      );
    // Busca todos os ID_CODNOTA relevantes
    let query = "FROM [PEDIDOORCAMENTO] WHERE [ID_CODFILIAIS] = '1'";
    if (pedido) {
      if (pedido.numero) query += ` AND [ID_NUMPEDORC] = '${pedido.numero}'`;
      if (pedido.cnpj)
        query += ` AND [ID_CODENTIDADE] = '${clienteResult.recordset[0].ID_CODENTIDADE}'`;
      if (pedido.dataInicial)
        query += ` AND [PEDOR_DATA] >= CONVERT(date, '${pedido.dataInicial}', 126)`;
      if (pedido.dataFinal)
        query += ` AND [PEDOR_DATA] <= CONVERT(date, '${pedido.dataFinal}', 126)`;
      if (pedido.situacao)
        query += ` AND [PEDOR_SITUACAO] = '${pedido.situacao}'`;
      if (pedido.vendedor)
        query += ` AND [ID_CODVENDEDOR] = '${pedido.vendedor}'`;
    }
    console.log("SELECT * " + query);

    const vwNotaResult = await connection.request().query("SELECT * " + query);

    return vwNotaResult.recordset;
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchPedido };
