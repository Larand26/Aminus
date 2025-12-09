const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar } = require("mssql");

const searchTotalPedidos = async (pedido) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "SearchTotalPedidos.sql");
    let query = fs.readFileSync(queryPath, "utf8");
    const request = connection.request();

    let conditions = [];

    if (pedido?.nomeVendedor && pedido.nomeVendedor != "ADMIN") {
      conditions.push("V.[VEND_NOME] = @nomeVendedor");
      request.input("nomeVendedor", VarChar, pedido.nomeVendedor);
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
    console.error("Erro ao buscar pedidos:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchTotalPedidos };
