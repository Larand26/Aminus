import { DataTable } from "primereact/datatable";
import Content from "../components/Content";
import { Column } from "primereact/column";

const ControlePlaza = () => {
  return (
    <div className="flex">
      <Content titulo={"Controle Plaza"}>
        <DataTable
          value={[
            { id: 1, name: "Plaza A", status: "Active" },
            { id: 2, name: "Plaza B", status: "Inactive" },
            { id: 3, name: "Plaza C", status: "Active" },
          ]}
          scrollable
          scrollHeight="400px"
        >
          <Column sortable field="id" header="ID" />
          <Column sortable field="name" header="Name" />
          <Column sortable field="status" header="Status" />
        </DataTable>
      </Content>
    </div>
  );
};

export default ControlePlaza;
