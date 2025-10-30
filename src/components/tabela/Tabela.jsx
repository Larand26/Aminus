import React from "react";

import InputRadio from "../InputRadio";
import CheckBox from "../CheckBox";
import Loading from "../Loading";

import "../../styles/tabela.css";

const Tabela = (props) => {
  const isLoading = !!props.loading;
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
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };
  const formataDataHora = (valor) => {
    if (!valor) return valor;
    const data = new Date(valor);
    return data.toLocaleString("pt-BR", { timeZone: "UTC" });
  };
  const formataJunto = (item, dados) => {
    return dados.map((dado) => item[dado]).join(" - ");
  };

  const handleSelectAll = () => {
    // Se todos estiverem selecionados, desmarca todos. Caso contrário, marca todos.
    if (
      props.linhasSelecionadas?.length === props.dados?.length &&
      props.dados?.length > 0
    ) {
      props.onLinhasSelecionadasChange([]); // Passa um array vazio para desmarcar
    } else {
      props.onLinhasSelecionadasChange(props.dados ? [...props.dados] : []); // Passa todos os dados para marcar
    }
  };

  const allSelected =
    props.dados &&
    props.dados.length > 0 &&
    props.linhasSelecionadas?.length === props.dados?.length;

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {colunasVisiveis.map((child, index) => (
              <th key={index}>
                {child.props.format === "checkbox" ? (
                  <CheckBox checked={allSelected} onChange={handleSelectAll} />
                ) : (
                  child.props.titulo || "Cabeçalho"
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="loading-row">
              <td colSpan={numColunas} style={{ padding: 0 }}>
                <div style={{ position: "relative", minHeight: 120 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.6)",
                      zIndex: 2,
                    }}
                  >
                    <Loading />
                  </div>
                  <div style={{ visibility: "hidden" }}>
                    {/* mantém a estrutura da tabela por baixo para evitar quebra de layout */}
                    <table className="tabela">
                      <tbody>
                        <tr>
                          {Array.from({ length: numColunas }).map((_, i) => (
                            <td key={i} />
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          )}
          {!isLoading ? (
            props.dados && props.dados.length > 0 ? (
              props.dados.map((item, index) => {
                // Encontra a coluna que tem uma função onClick
                const clickableColumn = colunasVisiveis.find(
                  (child) => child.props.onClick
                );

                // Define o manipulador de clique para a linha inteira
                const handleRowClick = clickableColumn
                  ? () => clickableColumn.props.onClick(item)
                  : null;

                return (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "par" : "impar"} ${
                      props.hover ? "hover" : ""
                    }`}
                    onClick={handleRowClick}
                    style={{ cursor: handleRowClick ? "pointer" : "default" }}
                  >
                    {colunasVisiveis.map((child, childIndex) => {
                      const cellContent = (() => {
                        if (typeof child.props.body === "function")
                          return child.props.body(item);

                        const valor = item[child.props.campo];

                        // Formatação de dinheiro
                        if (child.props.format === "dinheiro") {
                          return formataDinheiro(valor);
                        }

                        if (valor instanceof Date) {
                          if (child.props.format === "data") {
                            return formataData(valor);
                          }
                          if (child.props.format === "data-hora") {
                            return formataDataHora(valor);
                          }
                        }

                        if (child.props.format === "junto") {
                          return formataJunto(item, child.props.dados);
                        }

                        if (child.props.format === "radio") {
                          return (
                            <InputRadio
                              checked={props.linhaSelecionada === item}
                              onChange={() =>
                                props.onLinhaSelecionadaChange(item)
                              }
                            />
                          );
                        }

                        if (child.props.format === "checkbox") {
                          const isChecked =
                            props.linhasSelecionadas &&
                            props.linhasSelecionadas.includes(item);
                          return (
                            <CheckBox
                              checked={isChecked}
                              onChange={() =>
                                props.onLinhasSelecionadasChange(item)
                              }
                            />
                          );
                        }

                        return valor || "";
                      })();

                      return (
                        <td
                          key={childIndex}
                          className={item.PERSONALIZADO ? "selecionado" : ""}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={numColunas}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {props.semDados || "Nenhum dado encontrado"}
                </td>
              </tr>
            )
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default Tabela;
