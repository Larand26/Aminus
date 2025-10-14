import React from "react";

import "../../styles/tabela.css";

const Tabela = (props) => {
  // Filtra os filhos para remover valores nulos ou falsos
  const colunasVisiveis = React.Children.toArray(props.children).filter(
    Boolean
  );

  // Conta o número de colunas para usar no colSpan
  const numColunas = colunasVisiveis.length;

  // Formatos
  const formataDinheiro = (valor) => {
    if (typeof valor !== "number") return valor;
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  const formataData = (valor) => {
    if (!valor) return valor;
    const data = new Date(valor);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {colunasVisiveis.map((child, index) => (
              <th key={index}>{child.props.titulo || "Cabeçalho"}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.dados && props.dados.length > 0 ? (
            props.dados.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "par" : "impar"}>
                {colunasVisiveis.map((child, childIndex) => (
                  <td key={childIndex}>
                    {(() => {
                      if (typeof child.props.body === "function")
                        return child.props.body(item);

                      const valor = item[child.props.campo];

                      // Formatação de dinheiro
                      if (child.props.format === "dinheiro") {
                        return formataDinheiro(valor);
                      }

                      if (valor instanceof Date) {
                        return formataData(valor);
                      }

                      return valor || "";
                    })()}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={numColunas}
                style={{ textAlign: "center", padding: "20px" }}
              >
                {props.semDados || "Nenhum dado encontrado"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabela;
