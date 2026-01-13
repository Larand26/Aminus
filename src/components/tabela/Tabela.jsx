import React, { useState, useEffect, useMemo } from "react";

import InputRadio from "../InputRadio";
import CheckBox from "../CheckBox";
import Loading from "../Loading";

import "../../styles/tabela.css";

const Tabela = (props) => {
  const { dados, chave, onSelectionChange, itemSelecionado, search } = props;
  const [selecionados, setSelecionados] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [copiados, setCopiados] = useState({}); // Novo estado para controlar células copiadas
  const [linhaEditando, setLinhaEditando] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({});

  // Efeito para notificar o componente pai sobre mudanças na seleção
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selecionados);
    }
  }, [selecionados, onSelectionChange]);

  // Efeito para limpar a seleção quando os dados da tabela mudam
  useEffect(() => {
    setSelecionados((prevSelecionados) => {
      if (!dados || !chave) return [];
      const dadosMap = new Map(dados.map((item) => [item[chave], item]));
      return prevSelecionados
        .map((selecionado) => dadosMap.get(selecionado[chave]))
        .filter(Boolean);
    });
  }, [dados, chave]);

  // Formatos (movidos para cima para serem usados na filtragem)
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

  // Filtra os filhos para remover valores nulos ou falsos
  const colunasVisiveis = React.Children.toArray(props.children).filter(
    Boolean
  );

  const dadosFiltrados = useMemo(() => {
    if (!termoBusca) {
      return dados || [];
    }
    if (!dados) {
      return [];
    }

    const termoBuscaLower = termoBusca.toLowerCase();

    return dados.filter((item) => {
      return colunasVisiveis.some((child) => {
        let cellText;

        if (typeof child.props.body === "function") {
          const bodyResult = child.props.body(item);
          if (
            typeof bodyResult === "string" ||
            typeof bodyResult === "number"
          ) {
            cellText = bodyResult;
          } else {
            return false;
          }
        } else {
          const valor = item[child.props.campo];
          const formato = child.props.format || "";

          switch (formato) {
            case "dinheiro":
              cellText = formataDinheiro(valor);
              break;
            case "data":
              cellText = formataData(valor);
              break;
            case "data-hora":
              cellText = formataDataHora(valor);
              break;
            case "junto":
              cellText = formataJunto(item, child.props.dados);
              break;
            case "peso":
              cellText = formataPeso(valor, child.props.medida);
              break;
            case "radio":
            case "checkbox":
              return false;
            default:
              cellText = valor;
              break;
          }
        }

        return String(cellText).toLowerCase().includes(termoBuscaLower);
      });
    });
  }, [dados, termoBusca, colunasVisiveis]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelecionados(dadosFiltrados || []);
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
    dadosFiltrados &&
    dadosFiltrados.length > 0 &&
    selecionados.length === dadosFiltrados.length;

  const isLoading = !!props.loading;

  // Conta o número de colunas para usar no colSpan
  const numColunas = colunasVisiveis.length;
  // Se há coluna de seleção (checkbox no header), conta ela também
  const totalColunas = numColunas + (props.select == "checkbox" ? 1 : 0);

  return (
    <div
      className="tabela-container"
      style={{ maxHeight: props.tamMax || "630px" }}
    >
      <table className="tabela">
        <thead>
          {search && (
            <tr>
              <th colSpan={totalColunas} className="th-search">
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </th>
            </tr>
          )}
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
              if (child.props.campo === "search") return null;
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
            dadosFiltrados && dadosFiltrados.length > 0 ? (
              dadosFiltrados.map((item, index) => {
                // Encontra a coluna que tem uma função onClick
                const clickableColumn = colunasVisiveis.find(
                  (child) => child.props.onClick
                );

                // Define o manipulador de clique para a linha inteira
                const handleRowClick = clickableColumn
                  ? () => clickableColumn.props.onClick(item)
                  : null;

                const isEditing =
                  linhaEditando && linhaEditando[chave] === item[chave];

                const handleInputChange = (campo, valor) => {
                  setValoresEditados((prev) => ({
                    ...prev,
                    [campo]: valor,
                  }));
                };

                return (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "par" : "impar"} ${
                      props.hover ? "hover" : ""
                    } ${
                      itemSelecionado && item[chave] === itemSelecionado[chave]
                        ? "linha-selecionada"
                        : ""
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
                      // Não renderiza a célula da coluna se for a de pesquisa
                      if (child.props.campo === "search") return null;

                      // Verifica se está em modo de edição e se a coluna é editável
                      if (isEditing && child.props.editavel) {
                        return (
                          <td key={childIndex}>
                            <input
                              type="text"
                              value={
                                valoresEditados[child.props.campo] ??
                                item[child.props.campo]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  child.props.campo,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        );
                      }

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
                          const isDisabled =
                            typeof child.props.disabled === "function"
                              ? child.props.disabled(item)
                              : child.props.disabled || false;
                          return (
                            <CheckBox
                              id={`checkbox-${childIndex}-${index}`}
                              checked={child.props.state[index] || false}
                              onChange={() =>
                                child.props.onChange
                                  ? child.props.onChange(index)
                                  : () => {}
                              }
                              disabled={isDisabled}
                            />
                          );
                        }

                        if (child.props.format === "edit") {
                          if (isEditing) {
                            return (
                              <div className="action-buttons">
                                <button
                                  className="action-btn save"
                                  title="Salvar"
                                  onClick={() => {
                                    props.onEdit({
                                      ...item,
                                      ...valoresEditados,
                                    });
                                    setLinhaEditando(null);
                                    setValoresEditados({});
                                  }}
                                >
                                  <i className="fa fa-save"></i>
                                </button>
                                <button
                                  className="action-btn cancel"
                                  title="Cancelar"
                                  onClick={() => {
                                    setLinhaEditando(null);
                                    setValoresEditados({});
                                  }}
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </div>
                            );
                          }
                          return (
                            <div className="action-buttons">
                              <button
                                className="action-btn edit"
                                title="Editar"
                                onClick={() => {
                                  setLinhaEditando(item);
                                  setValoresEditados({});
                                }}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="action-btn delete"
                                title="Excluir"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          );
                        }

                        return valor || "0";
                      })();

                      // Função para copiar o conteúdo ao clicar
                      const handleCopy = (
                        rowIndex,
                        childIndex,
                        cellContent
                      ) => {
                        if (colunasVisiveis[childIndex].props.copy) {
                          let textoCopiar = cellContent;
                          if (React.isValidElement(cellContent)) {
                            if (
                              typeof cellContent.props.children === "string"
                            ) {
                              textoCopiar = cellContent.props.children;
                            } else {
                              textoCopiar = "";
                            }
                          }
                          navigator.clipboard.writeText(String(textoCopiar));
                          // Marca como copiado
                          const key = `${index}-${childIndex}`;
                          setCopiados((prev) => ({ ...prev, [key]: true }));
                          setTimeout(() => {
                            setCopiados((prev) => {
                              const novo = { ...prev };
                              delete novo[key];
                              return novo;
                            });
                          }, 1000);
                        }
                      };

                      return (
                        <td
                          key={childIndex}
                          className={`${
                            item.PERSONALIZADO ? "selecionado" : ""
                          } ${
                            copiados[`${index}-${childIndex}`] ? "copiado" : ""
                          } item-copiavel`}
                          style={
                            child.props.copy ? { cursor: "pointer" } : undefined
                          }
                          onClick={
                            child.props.copy
                              ? () => handleCopy(index, childIndex, cellContent)
                              : undefined
                          }
                          title={
                            child.props.copy ? "Clique para copiar" : undefined
                          }
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
                  {termoBusca
                    ? "Nenhum resultado encontrado"
                    : props.semDados || "Nenhum dado encontrado"}
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
