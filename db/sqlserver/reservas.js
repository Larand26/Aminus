const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar, NVarChar } = require("mssql");

const searchReserva = async (reserva) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "searchReserva.sql");
    let query = fs.readFileSync(queryPath, "utf8");
    const request = connection.request();
    let conditions = [];

    if (reserva) {
      if (reserva.codInterno) {
        conditions.push("PR.[ID_CODPRODUTO] = @codInterno");
        request.input("codInterno", VarChar, reserva.codInterno);
      }
      if (reserva.numPedido) {
        conditions.push("PR.[ID_NUMPEDORC] = @numPedido");
        request.input("numPedido", VarChar, reserva.numPedido);
      }
      if (reserva.codFabricante) {
        conditions.push("P.[PROD_CODFABRIC] = @codFabricante");
        request.input("codFabricante", VarChar, reserva.codFabricante);
      }
      if (reserva.nomeCliente) {
        conditions.push("PO.[PEDOR_RAZAOSOCIAL] LIKE @nomeCliente");
        request.input("nomeCliente", NVarChar, `%${reserva.nomeCliente}%`);
      }
      if (reserva.vendedor) {
        conditions.push("PO.[ID_CODVENDEDOR] = @vendedor");
        request.input("vendedor", VarChar, reserva.vendedor);
      }
    }

    if (conditions.length > 0) {
      query = query.replace(
        "-- Os filtros serão adicionados aqui pelo Node.js",
        `AND ${conditions.join(" AND ")}`
      );
    }

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchReserva };
