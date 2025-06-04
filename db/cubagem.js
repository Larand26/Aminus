const conectarSql = require("./database");
const makeCubagem = async (arg) => {
  const connection = await conectarSql();
  try {
    const codigos = arg.map((item) => item.ID_CODPRODUTO).join(",");
    const query = `SELECT [PROD_COMPRIMENTO], [PROD_LARGURA], [PROD_ALTURA] FROM [PRODUTOS] WHERE ID_CODPRODUTO IN (${codigos})`;
    const result = await connection.request().query(query);
    //junta o arg com o resultado da consulta
    const produtosComCubagem = arg.map((item) => {
      const produtoCubagem = result.recordset.find(
        (prod) => prod.ID_CODPRODUTO === item.ID_CODPRODUTO
      );
      if (produtoCubagem) {
        return {
          ...item,
          PROD_COMPRIMENTO: produtoCubagem.PROD_COMPRIMENTO,
          PROD_LARGURA: produtoCubagem.PROD_LARGURA,
          PROD_ALTURA: produtoCubagem.PROD_ALTURA,
        };
      }
      return item;
    });

    return produtosComCubagem;
  } catch (error) {
    console.error("Erro ao calcular cubagem:", error);
    throw new Error(error.message || "Erro desconhecido");
  }
};

module.exports = { makeCubagem };
