import { DataTable } from "primereact/datatable";
import Content from "../components/Content";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

const ControlePlaza = () => {
  const [csv, setCsv] = useState([]);

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
        <DataTable scrollable scrollHeight="400px" value={csv}>
          <Column field="acao" header="Ação" />
          <Column field="status" header="Status" />
          <Column
            field="Transferido ao seller"
            header="Transferido ao seller"
          />
          <Column field="CNPJ" header="CNPJ" />
          <Column field="Razão Social" header="Razão Social" />
          <Column field="Seller" header="Seller" />
          <Column field="Data da Operação" header="Data da operação" />
          <Column field="Nº da NF" header="Nota fiscal" />
          <Column field="Taxa Plaza" header="Taxa Plaza" />
          <Column field="Taxa Antecipação" header="Taxa Antecipação" />
          <Column field="Data de Vencimento" header="Data de Vencimento" />
          <Column field="Valor de Repasse" header="Valor de Repasse" />
          <Column
            field="Repasse Total do lote"
            header="Repasse Total do lote"
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
