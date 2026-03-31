import { Component } from "react";

// Components
// misc

// inputs
import InputText from "../inputs/InputText";

// buttons
import ActionButtons from "../buttons/ActionButtons";

// table
import TableColumn from "../table/TableColumn";
import Column from "../table/Column";

class ContactsPage extends Component {
  render() {
    const {
      contactsData,
      isEditing = false,
      newValue, // {name, number, cnpj}
      onEdit,
      onDelete,
    } = this.props;
    return (
      <>
        <div className=""></div>
        <div>
          <TableColumn data={contactsData} maxHeight={"400px"}>
            <Column id={"CONTATO_ID"} label={"ID"} />
            <Column
              id={"CONTATO_NOME"}
              label={"Nome"}
              body={(rowData) =>
                isEditing ? (
                  <InputText
                    value={rowData.CONTATO_NOME}
                    onChange={(value) => {}}
                  />
                ) : (
                  rowData.CONTATO_NOME
                )
              }
            />
            <Column
              id={"CONTATO_NUMERO"}
              label={"Número"}
              body={(rowData) =>
                isEditing ? (
                  <InputText
                    value={rowData.CONTATO_NUMERO}
                    onChange={(value) => {}}
                  />
                ) : (
                  rowData.CONTATO_NUMERO
                )
              }
            />
            <Column
              id={"CONTATO_CNPJ"}
              label={"CNPJ"}
              body={(rowData) =>
                isEditing ? (
                  <InputText
                    value={rowData.CONTATO_CNPJ}
                    onChange={(value) => {}}
                  />
                ) : (
                  rowData.CONTATO_CNPJ
                )
              }
            />
            <Column id={"NOME"} label={"Vendedor"} />
            <Column
              label={"Ações"}
              body={(rowData) => {
                return (
                  <ActionButtons
                    onEdit={() => onEdit(rowData)}
                    onDelete={() => onDelete(rowData)}
                  />
                );
              }}
            />
          </TableColumn>
        </div>
      </>
    );
  }
}

export default ContactsPage;
