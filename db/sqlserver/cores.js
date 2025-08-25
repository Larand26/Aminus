const conectarSql = require("../../config/database");

const getCores = async () => {
  const connection = await conectarSql();
  try {
    // Busca todos os ID_CODNOTA relevantes
    let query =
      "SELECT [ID_CHAVE] AS 'value', [DESCRICAO] AS 'label' FROM [CORES_ECOMERCE]";

    const result = await connection.request().query(query);

    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar cores:", error);
  } finally {
    connection.close();
  }
};

module.exports = { getCores };
