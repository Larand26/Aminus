const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar, Date, Int } = require("mssql");

const searchNotas = async (nota) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "SearchNotas.sql");
    let query = fs.readFileSync(queryPath, "utf8");
    const request = connection.request();
    let conditions = [];

    if (nota) {
      if (nota.numNota) {
        conditions.push(`NF.[NF_NUMDOCUM] = @numero`);
        request.input("numero", VarChar, nota.numNota);
      }
      if (nota.cnpj) {
        conditions.push(`NF.[NF_CGCCPFENTIDADE] = @cnpj`);
        request.input("cnpj", VarChar, nota.cnpj.replace(/\D/g, ""));
      }
      if (nota.dataInicial) {
        conditions.push(`NF.[NF_DATAEMIS] >= @dataInicial`);
        request.input("dataInicial", Date, nota.dataInicial);
      }
      if (nota.dataFinal) {
        conditions.push(`NF.[NF_DATAEMIS] <= @dataFinal`);
        request.input("dataFinal", Date, nota.dataFinal);
      }
      if (nota.uf) {
        conditions.push(`NF.[NF_UNIDFEDENTD] = @uf`);
        request.input("uf", VarChar, nota.uf);
      }
      if (nota.vendedor) {
        conditions.push(`NF.[ID_CODVENDEDOR] = @vendedor`);
        request.input("vendedor", Int, nota.vendedor);
      }
      if (nota.transportadora) {
        conditions.push(`NF.[ID_CODTRANSP] = @transportadora`);
        request.input("transportadora", Int, nota.transportadora);
      }
    }

    if (conditions.length > 0) {
      query = query.replace(
        "-- Os filtros serão adicionados aqui pelo Node.js",
        `AND ${conditions.join(" AND ")}`,
      );
    }

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchNotas };
