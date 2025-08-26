const conectarSql = require("../../config/database");

const cadastroWeb = async (produtos) => {
  const connection = await conectarSql();
  try {
    for (const prod of produtos) {
      const query1 = `
        UPDATE [PRODUTOS_ECOMERCE]
        SET 
          [DESCRICAO] = '${prod.PROD_NOME}',
          [SKU_PRODUTO_PAI] = '${prod.PROD_PAI}',
          [ID_CORES_ECOMERCE] = ${prod.PROD_IDCOR || 1}
        WHERE [ID_CODPRODUTO] = ${prod.ID_CODPRODUTO};
      `;

      await connection.request().query(query1);

      const query2 = `
        UPDATE [PRODUTOS_EMPRESASFILIAIS]
        SET 
          [PRO_ATIVO_ECOMMERCE] = ${prod.PROD_ATIVO ? 1 : 0},
          [PRO_INTEGRACAO_ECOMMERCE] = ${prod.PROD_ATIVO ? 1 : 0}
        WHERE [ID_CODPRODUTO] = ${prod.ID_CODPRODUTO};
      `;
      await connection.request().query(query2);
    }

    return true;
  } catch (error) {
    console.error("Erro ao cadastrar produtos:", error);
  } finally {
    connection.close();
  }
};

module.exports = { cadastroWeb };
