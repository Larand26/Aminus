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
          <Column field="status" header="Status" />
          <Column
            body={(rowData) =>
              "R$ " +
              (
                rowData["Valor Nominal"] -
                rowData["Valor Nominal"] * taxaPlaza -
                rowData["Valor Nominal"] * taxaLiber
              ).toFixed(2)
            }
            header="Transferido ao seller"
          />
          <Column
            body={(rowData) => rowData.parcelas.join(" | ")}
            header="Parcelas"
          />
          <Column field="CNPJ" header="CNPJ" />
          <Column field="Razão Social" header="Razão Social" />
          <Column field="Seller" header="Seller" />
          <Column field="Data da Operação" header="Data da operação" />
          <Column field="Nº da NF" header="Nota fiscal" />
          <Column
            body={(rowData) =>
              "R$ " + (rowData["Valor Nominal"] * taxaPlaza).toFixed(2)
            }
            header="Taxa Plaza"
          />
          <Column
            body={(rowData) =>
              "R$ " + (rowData["Valor Nominal"] * taxaLiber).toFixed(2)
            }
            header="Taxa Antecipação"
          />
          <Column field="Data de Vencimento" header="Data de Vencimento" />
          <Column
            body={(rowData) =>
              "R$ " + rowData.valoresRepasse.join(" | ") || "R$ 0,00"
            }
            header="Valor de Repasse"
          />
          <Column
            field="Repasse final do Lote"
            header="Repasse final do lote"
          />
          <Column field="Data do pagamento" header="Data do Pagamento" />
          <Column
            field="Número do Pedido (Plaza)"
            header="Número do Pedido (Plaza)"
          />
          <Column field="Data de Entrega" header="Data de Entrega" />
          <Column field="Transportadora" header="Transportadora" />
        </DataTable>
      </Content>
    </div>
  );
};

export default ControlePlaza;
