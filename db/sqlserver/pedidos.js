const conectarSql = require("../../config/database");
const fs = require("fs");
const path = require("path");
const { VarChar, Date, Int } = require("mssql");

const searchPedido = async (pedido) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "SearchPedidos.sql");
    let query = fs.readFileSync(queryPath, "utf8");
    const request = connection.request();

    let conditions = [];

    if (pedido?.numPedido) {
      conditions.push("PO.[ID_NUMPEDORC] = @numPedido");
      request.input("numPedido", VarChar, pedido.numPedido);
    }
    if (pedido?.cnpj) {
      conditions.push("E.[ENTI_CNPJCPF] = @cnpj");
      request.input("cnpj", VarChar, pedido.cnpj);
    }
    if (pedido?.dataInicial) {
      conditions.push("PO.[PEDOR_DATA] >= @dataInicial");
      request.input("dataInicial", Date, pedido.dataInicial);
    }
    if (pedido?.dataFinal) {
      conditions.push("PO.[PEDOR_DATA] <= @dataFinal");
      request.input("dataFinal", Date, pedido.dataFinal);
    }
    if (pedido?.situacao) {
      conditions.push("PO.[PEDOR_SITUACAO] = @situacao");
      request.input("situacao", VarChar, pedido.situacao);
    }
    if (pedido?.vendedor) {
      conditions.push("PO.[ID_CODVENDEDOR] = @vendedor");
      request.input("vendedor", Int, pedido.vendedor);
    }

    if (conditions.length > 0) {
      query = query.replace(
        "-- Os filtros serão adicionados aqui pelo Node.js",
        `AND ${conditions.join(" AND ")}`
      );
    }

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

const getPedido = async (numero) => {
  const connection = await conectarSql();
  try {
    const queryPath = path.join(__dirname, "queries", "GetPedido.sql");
    const query = fs.readFileSync(queryPath, "utf8");

    const request = connection.request();
    request.input("numero", VarChar, numero);
    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error("Erro ao buscar itens do pedido:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

module.exports = { searchPedido, getPedido };
