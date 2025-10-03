const { query, VarChar } = require("mssql");
const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");

const searchCadastroProdutos = async (referencia) => {
  const connection = await conectarSql();
  try {
    // Constrói o caminho para o arquivo .sql
    const queryPath = path.join(
      __dirname,
      "queries",
      "searchCadastroProdutos.sql"
    );
    // Lê o conteúdo do arquivo
    const query = fs.readFileSync(queryPath, "utf8");

    const result = await connection
      .request()
      // Adiciona o parâmetro de forma segura
      .input("referencia", VarChar, referencia)
      .query(query);

    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchCadastroProdutos };
