import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import Content from "../components/Content";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";

const ControlePlaza = () => {
  const navigate = useNavigate();
  const [csv, setCsv] = useState([]);

  const getCsv = async () => {
    try {
      window.electronApi?.getCsv();
      window.electronApi?.onGetCsvResponse((data) => {
        if (!data || data.length === 0) {
          console.warn("No CSV data received or data is empty.");
          return;
        }
        setCsv(data);
        console.log("CSV data received:", data);
      });
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  useEffect(() => {
    getCsv(); // Chama a função ao montar o componente
  }, []);

  const changeAcao = async (acao, id) => {
    try {
      await window.electronApi?.changeAcao(acao, id);
      console.log(`Ação ${acao} alterada para o ID ${id}`);
      getCsv();
    } catch (error) {
      console.error("Error changing action:", error);
    }
  };

  return (
    <div className="flex">
      <div className="absolute top-0 left-0 p-2 flex gap-2">
        <Button
          icon="fa fa-home"
          className="bg-blue-500 border-none"
          onClick={() => navigate("/")}
        />
        <Button
          icon="fa fa-refresh"
          className="bg-blue-500 border-none"
          onClick={() => getCsv()}
        />
      </div>
      <Content titulo={"Controle Plaza"}>
        <DataTable scrollable scrollHeight="400px" value={csv} showGridlines>
          <Column
            body={(rowData) => {
              switch (rowData.ACAO) {
                case 0:
                  return (
                    <Button
                      label="Confirmar Crédito"
                      className="bg-green-500	border-none"
                      onClick={() => {
                        changeAcao(rowData.ACAO, rowData.id);
                      }}
                    />
                  );
                  break;
                case 1:
                  return (
                    <Button
                      label="Transferir Crédito"
                      className="bg-yellow-600	border-none"
                      onClick={() => {
                        changeAcao(rowData.ACAO, rowData.id);
                      }}
                    />
                  );
                  break;
                case 2:
                  return (
                    <Button
                      label="Repasse Finalizado"
                      disabled
                      className="surface-400 border-none"
                      onClick={() => {
                        changeAcao(rowData.ACAO, rowData.id);
                      }}
                    />
                  );
                default:
                  break;
              }
            }}
            header="Ação"
          />
          <Column
            body={(rowData) => {
              if (rowData.ACAO == 2) {
                return "Crédito Transferido";
              }
              return rowData.STATUS;
            }}
            header="Status"
          />
          <Column field="TRANSFERIDO_SELLER" header="Transferido ao seller" />
          <Column field="VALOR_NOMINAL" header="Parcelas" />
          <Column field="CNPJ" header="CNPJ" />
          <Column field="RAZAO_SOCIAL" header="Razão Social" />
          <Column field="SELLER" header="Seller" />
          <Column
            field="DATA_OPERACAO"
            header="Data da operação"
            body={(rowData) =>
              rowData.DATA_OPERACAO instanceof Date
                ? rowData.DATA_OPERACAO.toLocaleDateString()
                : rowData.DATA_OPERACAO || ""
            }
          />
          <Column field="NUMERO_NF" header="Nota fiscal" />
          <Column field="TAXA_PLAZA" header="Taxa Plaza" />
          <Column field="TAXA_LIBER" header="Taxa Antecipação" />
          <Column
            field="DATA_VENCIMENTO"
            header="Data de Vencimento"
            body={(rowData) =>
              rowData.DATA_VENCIMENTO instanceof Date
                ? rowData.DATA_VENCIMENTO.toLocaleDateString()
                : rowData.DATA_VENCIMENTO || ""
            }
          />
          <Column
            field="VALOR_REPASSE"
            header="Valor de Repasse"
            body={(rowData) =>
              typeof rowData.VALOR_REPASSE === "number"
                ? rowData.VALOR_REPASSE.toFixed(2).replace(".", ",")
                : rowData.VALOR_REPASSE || ""
            }
          />
          <Column
            field="REPASSE_FINAL"
            header="Repasse final do lote"
            body={(rowData) =>
              typeof rowData.REPASSE_FINAL === "number"
                ? rowData.REPASSE_FINAL.toFixed(2).replace(".", ",")
                : rowData.REPASSE_FINAL || ""
            }
          />
          <Column
            field="DATA_PAGAMENTO"
            header="Data do Pagamento"
            body={(rowData) =>
              rowData.DATA_PAGAMENTO instanceof Date
                ? rowData.DATA_PAGAMENTO.toLocaleDateString()
                : rowData.DATA_PAGAMENTO || ""
            }
          />
          <Column field="NUMERO_PEDIDO" header="Número do Pedido (Plaza)" />
          <Column
            field="DATA_ENTREGA"
            header="Data de Entrega"
            body={(rowData) =>
              rowData.DATA_ENTREGA instanceof Date
                ? rowData.DATA_ENTREGA.toLocaleDateString()
                : rowData.DATA_ENTREGA || ""
            }
          />
          <Column field="TRANSPORTADORA" header="Transportadora" />
        </DataTable>
      </Content>
    </div>
  );
};

export default ControlePlaza;
