import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { FilterMatchMode } from "primereact/api";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const search = () => {
    const cliente = {
      nome: document.getElementById("inputNome").value || null,
      cnpj: document.getElementById("inputCnpj").value || null,
      id: document.getElementById("inputId").value || null,
      celular: document.getElementById("inputCelular").value || null,
      email: document.getElementById("inputEmail").value || null,
    };
    window.electronApi?.searchCliente(cliente);
    window.electronApi?.onSearchClienteResponse((clientes) => {
      setClientes(clientes);
      document.getElementById("inputNome").value = "";
      document.getElementById("inputCnpj").value = "";
      document.getElementById("inputId").value = "";
      document.getElementById("inputCelular").value = "";
      document.getElementById("inputEmail").value = "";
    });
  };

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputNome" />
          <label htmlFor="inputNome">Nome</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputId" />
          <label htmlFor="inputId">ID</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCelular" />
          <label htmlFor="inputCelular">Celular</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputEmail" />
          <label htmlFor="inputEmail">Email</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Clientes"}>
        <DataTable
          value={clientes}
          paginator
          rows={10}
          showGridlines
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "ENTI_RAZAOSOCIAL",
            "ENTI_CNPJCPF",
            "ID_CODENTIDADE",
            "ENTI_CELULAR",
            "ENTI_EMAIL",
            "ENTI_CEP",
          ]}
          header={
            <InputText
              type="search"
              onInput={(e) =>
                setFilters({
                  ...filters,
                  global: {
                    value: e.target.value,
                    matchMode: FilterMatchMode.CONTAINS,
                  },
                })
              }
              placeholder="Filtrar clientes"
            />
          }
        >
          <Column field="ENTI_RAZAOSOCIAL" header="Nome" />
          <Column field="ENTI_CNPJCPF" header="CNPJ" />
          <Column field="ID_CODENTIDADE" header="ID" />
          <Column field="ENTI_CELULAR" header="Celular" />
          <Column field="ENTI_EMAIL" header="Email" />
          <Column field="ENTI_CEP" header="CEP" />
        </DataTable>
      </Content>
    </div>
  );
};

export default Clientes;
