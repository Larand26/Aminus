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
  constructor(props) {
    super(props);
    this.state = {
      isEditing: { status: false, id: null },
      newValue: { id: null, name: "", number: "", cnpj: "" },
    };
  }
  render() {
    const { contactsData, onDelete, onSave } = this.props;
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
                this.state.isEditing &&
                this.state.isEditing.id === rowData.CONTATO_ID ? (
                  <InputText
                    value={this.state.newValue.name}
                    onChange={(value) => {
                      this.setState({
                        newValue: { ...this.state.newValue, name: value },
                      });
                    }}
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
                this.state.isEditing &&
                this.state.isEditing.id === rowData.CONTATO_ID ? (
                  <InputText
                    value={this.state.newValue.number}
                    onChange={(value) => {
                      this.setState({
                        newValue: { ...this.state.newValue, number: value },
                      });
                    }}
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
                this.state.isEditing &&
                this.state.isEditing.id === rowData.CONTATO_ID ? (
                  <InputText
                    value={this.state.newValue.cnpj}
                    onChange={(value) => {
                      this.setState({
                        newValue: { ...this.state.newValue, cnpj: value },
                      });
                    }}
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
                    onEdit={() => {
                      this.setState({
                        isEditing: { status: true, id: rowData.CONTATO_ID },
                        newValue: {
                          id: rowData.CONTATO_ID,
                          name: rowData.CONTATO_NOME,
                          number: rowData.CONTATO_NUMERO,
                          cnpj: rowData.CONTATO_CNPJ,
                        },
                      });
                    }}
                    isEditing={this.state.isEditing?.status || false}
                    onDelete={() => onDelete(rowData)}
                    onSave={() => {
                      this.setState({ isEditing: { status: false, id: null } });
                      onSave(this.state.newValue);
                    }}
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
