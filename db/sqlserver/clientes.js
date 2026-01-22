const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar, Int } = require("mssql");

const searchCliente = async (cliente) => {
  const connection = await conectarSql();
  try {
    const request = connection.request();
    const queryPath = path.join(__dirname, "queries", "searchClientes.sql");
    let query = fs.readFileSync(queryPath, "utf8");
    let conditions = [];

    if (cliente) {
      if (cliente.nome) {
        conditions.push("[ENTI_RAZAOSOCIAL] LIKE @nome");
        request.input("nome", VarChar, `%${cliente.nome}%`);
      }
      if (cliente.cnpj) {
        conditions.push("[ENTI_CNPJCPF] = @cnpj");
        request.input("cnpj", VarChar, cliente.cnpj.replace(/\D/g, ""));
      }
      if (cliente.numCliente) {
        conditions.push("[ID_CODENTIDADE] = @numCliente");
        request.input("numCliente", Int, cliente.numCliente);
      }
      if (cliente.celular) {
        conditions.push("[ENTI_CELULAR] LIKE @celular");
        request.input("celular", VarChar, `%${cliente.celular}%`);
      }
      if (cliente.email) {
        conditions.push("[ENTI_EMAIL] LIKE @email");
        request.input("email", VarChar, `%${cliente.email}%`);
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
    console.error("Erro ao buscar clientes:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchCliente };
