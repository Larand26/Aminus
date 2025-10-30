const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar, NVarChar, Int } = require("mssql");

const searchProduto = async (produto) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "searchProdutos.sql");
    let query = fs.readFileSync(queryPath, "utf8");

    const request = connection.request();
    let conditions = [];

    if (produto) {
      if (produto.codInterno) {
        conditions.push(`P.[ID_CODPRODUTO] = @codInterno`);
        request.input("codInterno", VarChar, produto.codInterno);
      }
      if (produto.codFabricante) {
        conditions.push(`P.[PROD_CODFABRIC] = @codFabricante`);
        request.input("codFabricante", VarChar, produto.codFabricante);
      }
      if (produto.nome) {
        conditions.push(`P.[PROD_DESCRCOMPLETA] LIKE @nome`);
        request.input("nome", NVarChar, `%${produto.nome}%`);
      }
      if (produto.codBarras) {
        conditions.push(`P.[PROD_CODBARRA] = @codBarras`);
        request.input("codBarras", VarChar, produto.codBarras);
      }
      if (produto.quantidade) {
        conditions.push(
          `(P.[PROD_ESTATUAL] - ISNULL(R.QuantidadeReservada, 0)) >= @quantidade`
        );
        request.input("quantidade", Int, produto.quantidade);
      }
    }

    if (conditions.length > 0) {
      query = query.replace(
        "-- Os filtros serão adicionados aqui pelo Node.js",
        `AND ${conditions.join(" AND ")}`
      );
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = {
  searchProduto,
};
