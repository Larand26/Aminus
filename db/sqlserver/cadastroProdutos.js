const conectarSql = require("../../config/database");

const searchCadastroProdutos = async (referencia) => {
  const connection = await conectarSql();
  try {
    const result = await connection
      .request()
      .query(`SELECT * FROM [vwITEM] WHERE [PROD_CODFABRIC] = '${referencia}'`);

    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchCadastroProdutos };
