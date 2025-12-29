const connectMySql = require("../../config/databaseMySql");

const pegaKeys = async (filtros) => {
  try {
    const connection = await connectMySql();
    let query = "SELECT * FROM KEYS_WHATSAPP WHERE 1=1";
    let params = [];
    if (filtros?.vendedorId) {
      query += " AND VENDEDOR_ID = ?";
      params.push(filtros.vendedorId);
    }
    const [rows] = await connection.execute(query, params);
    connection.end();
    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar keys:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};
module.exports = {
  pegaKeys,
};
