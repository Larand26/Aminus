const conectarSql = require("./database");

const searchReserva = async (reserva) => {
  const connection = await conectarSql();
  try {
    const reservaCompletos = [];
    if (reserva && (reserva.codigoInterno || reserva.numeroPedido)) {
      // Busca todos os ID_CODCLIENTE relevantes
      let query = "FROM [EST_RESERVA_PED] WHERE [ID_CODARMAZEN] = '2'";
      if (reserva) {
        if (reserva.codigoInterno)
          query += ` AND [ID_CODPRODUTO] = '${reserva.codigoInterno}'`;
        if (reserva.numeroPedido)
          query += ` AND [PROD_CODFABRIC] = '${reserva.numeroPedido}'`;
      }
      console.log("SELECT * " + query);

      const reservaResult = await connection
        .request()
        .query("SELECT * " + query);

      const vwResults = await connection
        .request()
        .query(
          `SELECT [PROD_CODFABRIC], [ID_CODPRODUTO] FROM [vwITEM] WHERE [ID_CODPRODUTO] IN (SELECT [ID_CODPRODUTO] ${query})`
        );
      const pedidosResult = await connection
        .request()
        .query(
          `SELECT * FROM [PEDIDOORCAMENTO] WHERE [ID_NUMPEDORC] IN (SELECT [ID_NUMPEDORC] ${query})`
        );

      reservaCompletos.push(
        ...reservaResult.recordset.map((reservaItem) => {
          const vwItem = vwResults.recordset.find(
            (item) => item.ID_CODPRODUTO === reservaItem.ID_CODPRODUTO
          );
          const pedido = pedidosResult.recordset.find(
            (ped) => ped.ID_NUMPEDORC === reservaItem.ID_NUMPEDORC
          );

          return {
            ...reservaItem,
            ID_CODFABRIC: vwItem ? vwItem.PROD : null,
            ID_CODPRODUTO: vwItem ? vwItem.ID_CODPRODUTO : null,
            ID_NUMPEDORC: pedido ? pedido.ID_NUMPEDORC : null,
            ID_CODVENDEDOR: pedido ? pedido.ID_CODVENDEDOR : null,
          };
        })
      );
    } else if (reserva && (reserva.referencia || reserva.nomeProduto)) {
      let query = "FROM [vwITEM] WHERE ID_DEPOSITOS = 2";
      if (reserva) {
        if (reserva.referencia)
          query += ` AND [PROD_CODFABRIC] = '${reserva.referencia}'`;
        if (reserva.nomeProduto)
          query += ` AND [PROD_DESCRCOMPLETA] LIKE '%${reserva.nomeProduto}%'`;
      }
      console.log("SELECT * " + query);

      const vwResults = await connection.request().query("SELECT * " + query);

      const reservaResult = await connection
        .request()
        .query(
          `SELECT * FROM [EST_RESERVA_PED] WHERE [ID_CODARMAZEN] = 2 AND [ID_CODPRODUTO] IN (SELECT [ID_CODPRODUTO] ${query})`
        );

      const pedidosResult = await connection
        .request()
        .query(
          `SELECT * FROM [PEDIDOORCAMENTO] WHERE [ID_NUMPEDORC] IN (SELECT [ID_NUMPEDORC] FROM [EST_RESERVA_PED] WHERE [ID_CODARMAZEN] = 2 AND [ID_CODPRODUTO] IN (SELECT [ID_CODPRODUTO] ${query}))`
        );

      reservaCompletos.push(
        ...reservaResult.recordset.map((reservaItem) => {
          const vwItem = vwResults.recordset.find(
            (item) => item.ID_CODPRODUTO === reservaItem.ID_CODPRODUTO
          );
          const pedido = pedidosResult.recordset.find(
            (ped) => ped.ID_NUMPEDORC === reservaItem.ID_NUMPEDORC
          );

          return {
            ...reservaItem,
            ...vwItem,
            ...pedido,
          };
        })
      );
    }
    return reservaCompletos;
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchReserva };
