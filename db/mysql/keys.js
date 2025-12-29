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

const atualizaUltimoUsoKey = async ({ data, vendedorId }) => {
  try {
    const connection = await connectMySql();
    const query =
      "UPDATE KEYS_WHATSAPP SET ULTIMA_MENSAGEM = ? WHERE VENDEDOR_ID = ?";
    await connection.execute(query, [data, vendedorId]);
    connection.end();
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar último uso da key:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

const pegaUltimoUsoKey = async (vendedorId) => {
  try {
    const connection = await connectMySql();
    const query =
      "SELECT ULTIMA_MENSAGEM FROM KEYS_WHATSAPP WHERE VENDEDOR_ID = ?";
    const [rows] = await connection.execute(query, [vendedorId]);
    connection.end();
    if (rows.length === 0) {
      return { success: false, error: "Key não encontrada para o vendedor." };
    }
    return { success: true, data: rows[0].ULTIMA_MENSAGEM };
  } catch (error) {
    console.error("Erro ao buscar último uso da key:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = {
  pegaKeys,
  atualizaUltimoUsoKey,
  pegaUltimoUsoKey,
};
