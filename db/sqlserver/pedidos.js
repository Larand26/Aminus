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
    const result = await connection
      .request()
      .query(
        `SELECT * FROM [ITENSPEDIDOORCAMENTO] WHERE [ID_NUMPEDORC] = '${numero}'`
      );

    const produtosResult = await connection
      .request()
      .query(
        `SELECT [ID_CODPRODUTO], [PROD_PESOLIQUIDO] FROM [PRODUTOS] WHERE [ID_CODPRODUTO] IN (SELECT [ID_CODPRODUTO] FROM [ITENSPEDIDOORCAMENTO] WHERE [ID_NUMPEDORC] = '${numero}')`
      );
    const produtos = produtosResult.recordset.reduce((acc, prod) => {
      acc[prod.ID_CODPRODUTO] = prod.PROD_PESOLIQUIDO;
      return acc;
    }, {});
    const itensPedido = result.recordset.map((item) => {
      return {
        ...item,
        PROD_PESOLIQUIDO: produtos[item.ID_CODPRODUTO] || 0,
      };
    });

    return itensPedido;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchPedido, getPedido };
