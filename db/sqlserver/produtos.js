const conectarSql = require("../../config/database");
const searchProduto = async (produto) => {
  const connection = await conectarSql();
  try {
    // Busca todos os ID_CODPRODUTO relevantes
    let query = "FROM [vwITEM] WHERE ID_DEPOSITOS = 2";
    if (produto) {
      if (produto.codInterno)
        query += ` AND [ID_CODPRODUTO] = '${produto.codInterno}'`;
      if (produto.codFabricante)
        query += ` AND [PROD_CODFABRIC] = '${produto.codFabricante}'`;
      if (produto.nome)
        query += ` AND [PROD_DESCRCOMPLETA] LIKE '%${produto.nome}%'`;
      if (produto.codBarras)
        query += ` AND [PROD_CODBARRA] = '${produto.codBarras}'`;
    }

    const vwItemResult = await connection.request().query("SELECT * " + query);

    // Para cada produto, busca as infos relacionadas
    const produtosCompletos = [];

    // Busca dados do produto
    const produtoResult = await connection.request().query(
      `SELECT * FROM [PRODUTOS] WHERE ID_CODPRODUTO in 
        (SELECT [ID_CODPRODUTO] ${query})`
    );
    // Busca dados de empresas filiais
    const empresasFiliaisResult = await connection.request().query(
      `SELECT [ID_CODPRODUTO], [PRO_ATIVO_ECOMMERCE], [PRO_INTEGRACAO_ECOMMERCE] FROM [PRODUTOS_EMPRESASFILIAIS] WHERE ID_CODPRODUTO IN 
        (SELECT [ID_CODPRODUTO] ${query}) AND ID_CODFILIAIS = 1`
    );
    const quantidadeReservaResult = await connection
      .request()
      .query(
        `SELECT * FROM [EST_RESERVA_PED] WHERE [ID_CODARMAZEN] = 2 AND [ID_CODPRODUTO] IN(SELECT [ID_CODPRODUTO] ${query})`
      );
    const enderecoResult = await connection
      .request()
      .query(
        `SELECT * FROM [PRODUTODEPOSITO] WHERE [ID_CODFILIAIS] = 1 AND [ID_CODPRODUTO] IN(SELECT [ID_CODPRODUTO] ${query})`
      );

    produtosCompletos.push(
      ...vwItemResult.recordset.map((item) => {
        const produtoInfo = produtoResult.recordset.find(
          (prod) => prod.ID_CODPRODUTO === item.ID_CODPRODUTO
        );
        const empresaFilialInfo = empresasFiliaisResult.recordset.find(
          (emp) => emp.ID_CODPRODUTO === item.ID_CODPRODUTO
        );
        const reservaInfo = quantidadeReservaResult.recordset.find(
          (res) => res.ID_CODPRODUTO === item.ID_CODPRODUTO
        );
        const enderecoInfo = enderecoResult.recordset.find(
          (end) => end.ID_CODPRODUTO === item.ID_CODPRODUTO
        );

        return {
          ...item,
          ...produtoInfo,
          ...empresaFilialInfo,
          ...reservaInfo,
          ...enderecoInfo,
        };
      })
    );

    connection.close();
    return produtosCompletos;
  } catch (error) {
    connection.close();
    // console.log("Erro ao buscar produtos:", error);
    return [];
  }
};

module.exports = {
  searchProduto,
};
