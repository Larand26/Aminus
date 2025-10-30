const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar } = require("mssql");

const searchCadastroProdutos = async (filtros) => {
  const connection = await conectarSql();
  try {
    // Constrói o caminho para o arquivo .sql
    const queryPath = path.join(
      __dirname,
      "queries",
      "searchCadastroProdutos.sql"
    );
    // Lê o conteúdo do arquivo
    let query = fs.readFileSync(queryPath, "utf8");
    let conditions = [];

    const request = connection.request();

    if (filtros) {
      if (filtros.codFabricante) {
        conditions.push("P.[PROD_CODFABRIC] = @codFabricante");
        request.input("codFabricante", VarChar, filtros.codFabricante);
      }
      if (filtros.codInterno) {
        conditions.push("P.[ID_CODPRODUTO] = @codInterno");
        request.input("codInterno", VarChar, filtros.codInterno);
      }
    }

    if (conditions.length > 0) {
      query = query.replace(
        "-- Os filtros serão adicionados aqui pelo Node.js",
        `AND ${conditions.join(" AND ")}`
      );
    }

    const result = await request.query(query); // Executa a query usando o objeto request

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
