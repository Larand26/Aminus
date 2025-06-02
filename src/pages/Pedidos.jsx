import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import vendedoresJson from "../assets/json/vendedores.json";
const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [situacao, setSituacao] = useState(null);

  const search = () => {
    const pedido = {
      numero: document.getElementById("inputNumero").value || null,
      cnpj: document.getElementById("inputCnpj").value || null,
      dataInicial: dataInicial ? dataInicial.toISOString() : null,
      dataFinal: dataFinal && dataInicial ? dataFinal.toISOString() : null,
      situacao: situacao || null,
      vendedor: vendedor || null,
    };
    console.log("Pesquisando pedido:", pedido);

    window.electronApi?.searchPedido(pedido);
    window.electronApi?.onSearchPedidoResponse((pedidos) => {
      setPedidos(pedidos);
      console.log("Pedidos recebidos:", pedidos);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputNumero").value = "";
      document.getElementById("inputCnpj").value = "";
      setDataInicial(null);
      setDataFinal(null);
      document.getElementById("inputSituacao").value = "";
      setVendedor(null);
    });
  };
  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputNumero" />
          <label htmlFor="inputNumero">Número do Pedido</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar id="inputDataInicial" />
          <label htmlFor="inputDataInicial">Data Inicial</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar id="inputDataFinal" />
          <label htmlFor="inputDataFinal">Data Final</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            className="md:w-12rem "
            options={[
              { label: "Pendente", value: "Pendente" },
              { label: "Cancelado", value: "Cancelado" },
              { label: "Atendido", value: "Atendido" },
            ]}
            id="inputSituacao"
          />
          <label htmlFor="inputSituacao">Situação</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            options={vendedoresJson}
            id="inputVendedor"
            className="md:w-12rem "
          />
          <label htmlFor="inputVendedor">Vendedor</label>
        </FloatLabel>
      </BarraLateral>
      <Content>
        <DataTable value={pedidos} id="tabelaPedidos">
          <Column field="numero" header="Número" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="data" header="Data" />
          <Column field="situacao" header="Situação" />
          <Column field="vendedor" header="Vendedor" />
        </DataTable>
      </Content>
    </div>
  );
};

export default Pedidos;
