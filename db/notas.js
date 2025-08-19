const conectarSql = require("../config/database");

const searchNotas = async (nota) => {
  const connection = await conectarSql();
  try {
    // Busca todos os ID_CODNOTA relevantes
    let query = "FROM [NOTAFISCAL] WHERE [ID_CODFILIAIS] = '1'";
    if (nota) {
      if (nota.numero) query += ` AND [NF_NUMDOCUM] = '${nota.numero}'`;
      if (nota.cnpj) query += ` AND [NF_CGCCPFENTIDADE] = '${nota.cnpj}'`;
      if (nota.dataInicial)
        query += ` AND [NF_DATAEMIS] >= CONVERT(date, '${nota.dataInicial}', 126)`;
      if (nota.dataFinal)
        query += ` AND [NF_DATAEMIS] <= CONVERT(date, '${nota.dataFinal}', 126)`;
      if (nota.uf) query += ` AND [NF_UNIDFEDENTD] = '${nota.uf}'`;
      if (nota.vendedor) query += ` AND [ID_CODVENDEDOR] = '${nota.vendedor}'`;
    }
    console.log("SELECT * " + query);

    const vwNotaResult = await connection.request().query("SELECT * " + query);

    return vwNotaResult.recordset;
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchNotas };
