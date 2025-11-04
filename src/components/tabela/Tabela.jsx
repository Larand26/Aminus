import React, { useState, useEffect } from "react";

import InputRadio from "../InputRadio";
import CheckBox from "../CheckBox";
import Loading from "../Loading";

import "../../styles/tabela.css";

const Tabela = (props) => {
  const { dados, chave, onSelectionChange } = props;
  const [selecionados, setSelecionados] = useState([]);

  // Efeito para notificar o componente pai sobre mudanças na seleção
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selecionados);
    }
  }, [selecionados, onSelectionChange]);

  // Efeito para limpar a seleção quando os dados da tabela mudam
  useEffect(() => {
    setSelecionados([]);
  }, [dados]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelecionados(dados || []);
    } else {
      setSelecionados([]);
    }
  };

  const handleSelectItem = (item) => {
    setSelecionados((prevSelecionados) => {
      const isSelected = prevSelecionados.some(
        (selecionado) => selecionado[chave] === item[chave]
      );
      if (isSelected) {
        return prevSelecionados.filter(
          (selecionado) => selecionado[chave] !== item[chave]
        );
      } else {
        return [...prevSelecionados, item];
      }
    });
  };

  const todosSelecionados =
    dados && dados.length > 0 && selecionados.length === dados.length;

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
  const formataPeso = (valor, medida) => {
    if (typeof valor !== "number") return valor;
    return `${valor.toFixed(2).replace(".", ",")} ${medida || "kg"}`;
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {props.select == "checkbox" && (
              <th>
                <CheckBox
                  id="select-all-checkbox"
                  checked={todosSelecionados}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {colunasVisiveis.map((child, index) => {
              const formato = child.props.format || "";

              switch (formato) {
                case "radio":
                  return (
                    <th key={index}>
                      <InputRadio checked={false} onChange={() => {}} />
                    </th>
                  );
                case "checkbox":
                  return (
                    <th key={index}>
                      <CheckBox
                        id={`header-checkbox-${child.props.id}`}
                        checked={
                          child.props.state &&
                          child.props.state.length > 0 &&
                          child.props.state.every(Boolean)
                        }
                        onChange={(e) =>
                          child.props.onChangeAll(e.target.checked)
                        }
                      />
                    </th>
                  );
                default:
                  break;
              }
              return <th key={index}>{child.props.titulo}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="loading-row">
              <td colSpan={numColunas} style={{ padding: 0 }}>
                <div style={{ position: "relative", minHeight: 120 }}>
                  <div className="loading-table">
                    <Loading />
                  </div>
                  <div style={{ visibility: "hidden" }}>
                    <tr>
                      {Array.from({ length: numColunas }).map((_, i) => (
                        <td key={i} />
                      ))}
                    </tr>
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
                    {props.select == "checkbox" && (
                      <td>
                        <CheckBox
                          checked={
                            !!chave &&
                            selecionados.some(
                              (selecionado) =>
                                selecionado[chave] === item[chave]
                            )
                          }
                          id={`select-item-checkbox-${index}`}
                          onChange={() => handleSelectItem(item)}
                        />
                      </td>
                    )}
                    {colunasVisiveis.map((child, childIndex) => {
                      const cellContent = (() => {
                        if (typeof child.props.body === "function")
                          return child.props.body(item);

                        const valor = item[child.props.campo];
                        const formato = child.props.format || "";

                        switch (formato) {
                          case "dinheiro":
                            return formataDinheiro(valor);
                          case "data":
                            return formataData(valor);
                          case "data-hora":
                            return formataDataHora(valor);
                          case "junto":
                            return formataJunto(item, child.props.dados);
                          case "peso":
                            return formataPeso(valor, child.props.medida);
                          default:
                            break;
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
                          return (
                            <CheckBox
                              id={`checkbox-${childIndex}-${index}`}
                              checked={child.props.state[index] || false}
                              onChange={() =>
                                child.props.onChange
                                  ? child.props.onChange(index)
                                  : () => {}
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
                {props.select == "checkbox" && <td></td>}
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
