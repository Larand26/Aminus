import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  return (
    <div className="flex">
      <BarraLateral>
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
      <Content>
        <DataTable value={clientes} paginator rows={10}>
          <Column field="nome" header="Nome" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="id" header="ID" />
          <Column field="celular" header="Celular" />
          <Column field="email" header="Email" />
        </DataTable>
      </Content>
    </div>
  );
};

export default Clientes;
