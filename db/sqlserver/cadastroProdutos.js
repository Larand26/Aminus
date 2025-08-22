const { query } = require("mssql");
const conectarSql = require("../../config/database");

const searchCadastroProdutos = async (referencia, sku) => {
  const connection = await conectarSql();
  try {
    const query = `
SELECT 
    P.[ID_CODPRODUTO],
    P.[PROD_DESCRCOMPLETA],
    P.[PROD_CODFABRIC],
    P.[ID_CODGRUPO],
    GI.[GRUP_DESCRICAO],
    PE.[ID_CORES_ECOMERCE],
    PE.[SKU_PRODUTO_PAI],
    PE.[ID_GRADE_ECOMERCE],
    CE.[DESCRICAO] AS COR_DESCRICAO,
    PA.[PRO_ATIVO_ECOMMERCE],
    PA.[PRO_INTEGRACAO_ECOMMERCE],
    PA.[ID_CODFILIAIS],
    STRING_AGG(CONVERT(VARCHAR, GE.[QUANTIDADE]), ',') AS QUANTIDADES,
    STRING_AGG(CONVERT(VARCHAR, GE.[NUMERO]), ',') AS NUMEROS
FROM [vwITEM] P
    INNER JOIN [GrupoItens] GI ON P.ID_CODGRUPO = GI.ID_CODGRUPO
    INNER JOIN [PRODUTOS_ECOMERCE] PE ON P.ID_CODPRODUTO = PE.ID_CODPRODUTO
    INNER JOIN [CORES_ECOMERCE] CE ON PE.ID_CORES_ECOMERCE = CE.ID_CHAVE
    INNER JOIN [GRADE_TAMANHO_ECOMERCE] GE ON PE.ID_GRADE_ECOMERCE = GE.ID_GRADE_ECOMERCE
    INNER JOIN [PRODUTOS_EMPRESASFILIAIS] PA ON P.ID_CODPRODUTO = PA.ID_CODPRODUTO
WHERE (P.[PROD_CODFABRIC] = '${referencia || ""}' OR P.[ID_CODPRODUTO] = '${
      sku || ""
    }')
AND PA.[ID_CODFILIAIS] = 1
GROUP BY 
    P.[ID_CODPRODUTO],
    P.[PROD_DESCRCOMPLETA],
    P.[PROD_CODFABRIC],
    P.[ID_CODGRUPO],
    GI.[GRUP_DESCRICAO],
    PE.[ID_CORES_ECOMERCE],
    PE.[SKU_PRODUTO_PAI],
    PE.[ID_GRADE_ECOMERCE],
    CE.[DESCRICAO],
    PA.[PRO_ATIVO_ECOMMERCE],
    PA.[PRO_INTEGRACAO_ECOMMERCE],
    PA.[ID_CODFILIAIS];
    `;
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchCadastroProdutos };
