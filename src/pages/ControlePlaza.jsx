import { DataTable } from "primereact/datatable";
import Content from "../components/Content";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";

const ControlePlaza = () => {
  const [csv, setCsv] = useState([]);
  const taxaPlaza = 0.06;
  const taxaLiber = 0.05;

  const getCsv = async () => {
    try {
      window.electronApi?.getCsv();
      window.electronApi?.onGetCsvResponse((data) => {
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

  return (
    <div className="flex">
      <Content titulo={"Controle Plaza"}>
        <DataTable scrollable scrollHeight="400px" value={csv} showGridlines>
          <Column
            body={(rowData) => {
              return (
                <Button
                  label="Ação"
                  onClick={() => {
                    console.log("Ação clicked for:", rowData);
                  }}
                />
              );
            }}
            header="Ação"
          />
          <Column field="STATUS" header="Status" />
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
