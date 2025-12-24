const connectMySql = require("../../config/databaseMySql");

const pegaContatos = async (filtros) => {
  try {
    const connection = await connectMySql();

    let query = "SELECT * FROM CONTATOS WHERE 1=1";
    let params = [];

    if (filtros?.nome) {
      query += " AND CONTATO_NOME LIKE ?";
      params.push(`%${filtros.nome}%`);
    }
    if (filtros?.numero) {
      query += " AND CONTATO_NUMERO = ?";
      params.push(filtros.numero);
    }
    if (filtros?.vendedorId) {
      query += " AND VENDEDOR_ID = ?";
      params.push(filtros.vendedorId);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();

    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = {
  pegaContatos,
};
