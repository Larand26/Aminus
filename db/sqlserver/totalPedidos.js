const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
<<<<<<< HEAD
const { VarChar } = require("mssql");

const searchTotalPedidos = async (pedido) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "SearchTotalPedidos.sql");
=======
const { VarChar, Date, Int } = require("mssql");

const searchTotalPedido = async (totalPedido) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "SearchPedidos.sql");
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587
    let query = fs.readFileSync(queryPath, "utf8");
    const request = connection.request();

    let conditions = [];

<<<<<<< HEAD
    if (pedido?.nomeVendedor && pedido.nomeVendedor != "ADMIN") {
      conditions.push("V.[VEND_NOME] = @nomeVendedor");
      request.input("nomeVendedor", VarChar, pedido.nomeVendedor);
=======
    if (totalPedido?.nomeVendedor && totalPedido?.nomeVendedor !== "ADMIN") {
      conditions.push("V.[VEND_NOME] = @nomeVendedor");
      request.input("nomeVendedor", VarChar, totalPedido.nomeVendedor);
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587
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

<<<<<<< HEAD
module.exports = { searchTotalPedidos };
=======
module.exports = { searchTotalPedido };
>>>>>>> b6977d60f77f7fc2f4651bb5281732b6b6968587
