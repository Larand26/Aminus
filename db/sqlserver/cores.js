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
    // Verifica se já existe uma cor com a mesma descrição
    const checkQuery =
      "SELECT COUNT(*) AS total FROM [CORES_ECOMERCE] WHERE [DESCRICAO] = @descricao";
    const checkResult = await connection
      .request()
      .input("descricao", descricao)
      .query(checkQuery);

    if (checkResult.recordset[0].total > 0) {
      // Já existe, não cria
      return { success: false, message: "Cor já existe" };
    }

    const query =
      "INSERT INTO [CORES_ECOMERCE] (DESCRICAO) VALUES (@descricao)";
    await connection.request().input("descricao", descricao).query(query);
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar cor:", error);
    return { success: false, error };
  } finally {
    connection.close();
  }
};

module.exports = { getCores, createCor };
