import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";

// table
import Table from "../components/table/Table";

// inputs
import InputText from "../components/inputs/InputText";

// table options
import tableOptions from "../assets/json/table_options/clientsOptions";

// scripts
import ClientUtil from "../utils/Client";

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsData: [],
      numClient: null,
      name: null,
      cnpj: null,
      celphone: null,
      email: null,
    };
  }

  static token = localStorage.getItem("token");

  async getClients() {
    const filters = {
      numClient: this.state.numClient || null,
      name: this.state.name || null,
      cnpj: this.state.cnpj || null,
      celphone: this.state.celphone || null,
      email: this.state.email || null,
    };

    const response = await ClientUtil.getClients({
      token: this.token,
      filters,
    });

    console.log(response);

    if (response.success) {
      this.setState({ clientsData: response.data });
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={() => this.getClients()}>
            <InputText
              label="Número do Cliente"
              value={this.state.numClient}
              onChange={(value) => this.setState({ numClient: value })}
            />
            <InputText
              label="Nome"
              value={this.state.name}
              onChange={(value) => this.setState({ name: value })}
            />
            <InputText
              label="CNPJ"
              value={this.state.cnpj}
              onChange={(value) => this.setState({ cnpj: value })}
            />
            <InputText
              label="Telefone"
              value={this.state.celphone}
              onChange={(value) => this.setState({ celphone: value })}
            />
            <InputText
              label="Email"
              value={this.state.email}
              onChange={(value) => this.setState({ email: value })}
            />
          </SideBar>
          <Content title="Clientes">
            <Table options={tableOptions} datas={this.state.clientsData} />
          </Content>
        </div>
      </>
    );
  }
}

export default Clients;
