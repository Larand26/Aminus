const conectarSql = require("../../config/database");

const getCores = async (descricao) => {
  const connection = await conectarSql();
  try {
    // Busca todos os ID_CODNOTA relevantes
    let query =
      "SELECT TOP 20 [ID_CHAVE] AS 'value', [DESCRICAO] AS 'label' FROM [CORES_ECOMERCE] WHERE [DESCRICAO] LIKE @descricao + '%'";

    const result = await connection
      .request()
      .input("descricao", descricao)
      .query(query);

    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar cores:", error);
  } finally {
    connection.close();
  }
};

const createCor = async (descricao) => {
  const connection = await conectarSql();
  try {
    const query =
      "INSERT INTO [CORES_ECOMERCE] (DESCRICAO) VALUES (@descricao)";
    await connection.request().input("descricao", descricao).query(query);
  } catch (error) {
    console.error("Erro ao criar cor:", error);
  } finally {
    connection.close();
  }
};

module.exports = { getCores, createCor };
