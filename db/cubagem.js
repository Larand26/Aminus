const conectarSql = require("./database");
const makeCubagem = async (arg) => {
  const connection = await conectarSql();
  try {
    const codigos = arg.map((item) => item.ID_CODPRODUTO).join(",");
    const query = `SELECT [ID_CODPRODUTO], [PROD_COMPRIMENTO], [PROD_LARGURA], [PROD_ALTURA] FROM [PRODUTOS] WHERE ID_CODPRODUTO IN (${codigos})`;
    const result = await connection.request().query(query);
    const resultvwItem = await connection
      .request()
      .query(
        `SELECT [ID_CODPRODUTO], [PROD_CODFABRIC] FROM [vwITEM] WHERE ID_DEPOSITOS = 2 AND ID_CODPRODUTO IN (${codigos})`
      );
    //junta o arg com o resultado da consulta
    const produtosComCubagem = arg.map((item) => {
      const produtoCubagem = result.recordset.find(
        (prod) => prod.ID_CODPRODUTO === item.ID_CODPRODUTO
      );
      const produtoFabricante = resultvwItem.recordset.find(
        (prod) => prod.ID_CODPRODUTO === item.ID_CODPRODUTO
      );
      if (produtoCubagem) {
        return {
          ...item,
          PROD_COMPRIMENTO: produtoCubagem.PROD_COMPRIMENTO,
          PROD_LARGURA: produtoCubagem.PROD_LARGURA,
          PROD_ALTURA: produtoCubagem.PROD_ALTURA,
          PROD_CODFABRIC: produtoFabricante
            ? produtoFabricante.PROD_CODFABRIC
            : null,
        };
      }
      return item;
    });

    connection.close();

    return produtosComCubagem;
  } catch (error) {
    connection.close();
    console.error("Erro ao calcular cubagem:", error);
    throw new Error(error.message || "Erro desconhecido");
  }
};

module.exports = { makeCubagem };
