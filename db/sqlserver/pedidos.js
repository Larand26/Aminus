const conectarSql = require("../../config/database");

const searchPedido = async (pedido) => {
  const connection = await conectarSql();
  try {
    const request = connection.request();

    let conditions = ["WHERE PO.[ID_CODFILIAIS] = '1'"];

    if (pedido?.numero) {
      conditions.push("AND PO.[ID_NUMPEDORC] = @numero");
      request.input("numero", pedido.numero);
    }
    if (pedido?.cnpj) {
      conditions.push("AND E.[ENTI_CNPJCPF] = @cnpj");
      request.input("cnpj", pedido.cnpj);
    }
    if (pedido?.dataInicial) {
      conditions.push("AND PO.[PEDOR_DATA] >= @dataInicial");
      request.input("dataInicial", pedido.dataInicial);
    }
    if (pedido?.dataFinal) {
      conditions.push("AND PO.[PEDOR_DATA] <= @dataFinal");
      request.input("dataFinal", pedido.dataFinal);
    }
    if (pedido?.situacao) {
      conditions.push("AND PO.[PEDOR_SITUACAO] = @situacao");
      request.input("situacao", pedido.situacao);
    }
    if (pedido?.vendedor) {
      conditions.push("AND PO.[ID_CODVENDEDOR] = @vendedor");
      request.input("vendedor", pedido.vendedor);
    }

    const query = `SELECT 
                    PO.*,
                    E.[ENTI_CEP],
                    E.[ENTI_CNPJCPF]
                    FROM [PEDIDOORCAMENTO] PO
                    LEFT JOIN [ENTIDADES] E ON PO.ID_CODENTIDADE = E.ID_CODENTIDADE 
                    ${conditions.join(" ")}`;
    const vwNotaResult = await request.query(query);

    return vwNotaResult.recordset;
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
  } finally {
    connection.close();
  }
};

const getPedido = async (numero) => {
  const connection = await conectarSql();
  try {
    const query = `
      SELECT 
        IPO.[ID_CODPRODUTO],
        IPO.[ITPEDOR_DESCRPROD],
        IPO.[ITPEDOR_QUANTID],
        IPO.[ITPEDOR_VLRUNIT],
        IPO.[ITPEDOR_VLRLIQU],
        P.[PROD_PESOLIQUIDO],
        P.[PROD_ALTURA],
        P.[PROD_LARGURA],
        P.[PROD_COMPRIMENTO],
        PE.[PROD_PESOBRUTO]
      FROM [ITENSPEDIDOORCAMENTO] IPO
      LEFT JOIN [PRODUTOS] P ON IPO.[ID_CODPRODUTO] = P.[ID_CODPRODUTO]
      LEFT JOIN [PRODUTOS_EMPRESASFILIAIS] PE ON IPO.[ID_CODPRODUTO] = PE.[ID_CODPRODUTO]
      WHERE IPO.[ID_NUMPEDORC] = @numero
        AND PE.[ID_CODFILIAIS] = 1
    `;
    const request = connection.request();
    request.input("numero", numero);
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchPedido, getPedido };
