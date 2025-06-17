import { DataTable } from "primereact/datatable";
import Content from "../components/Content";
import { Column } from "primereact/column";

const ControlePlaza = () => {
  return (
    <div className="flex">
      <Content titulo={"Controle Plaza"}>
        <DataTable scrollable scrollHeight="400px">
          <Column field="acao" header="Ação" />
          <Column field="status" header="Status" />
          <Column field="transferidoSeller" header="Transferido ao seller" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="razaoSocial" header="Razão Social" />
          <Column field="seller" header="Seller" />
          <Column field="data" header="Data da operação" />
          <Column field="nota" header="Nota fiscal" />
          <Column field="taxaPlaza" header="Taxa Plaza" />
          <Column field="taxaAntecipacao" header="Taxa Antecipação" />
          <Column field="dataVencimento" header="Data de Vencimento" />
          <Column field="valordeRepasse" header="Valor de Repasse" />
          <Column field="repasseTotal" header="Repasse Total do lote" />
          <Column field="dataDoPagamento" header="Data do Pagamento" />
          <Column field="numPedido" header="Número do Pedido (Plaza)" />
          <Column field="dataEntrega" header="Data de Entrega" />
          <Column field="transportadora" header="Transportadora" />
        </DataTable>
      </Content>
    </div>
  );
};

export default ControlePlaza;
