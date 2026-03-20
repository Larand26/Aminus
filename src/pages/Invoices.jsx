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
import Select from "../components/inputs/Select";
import InputDate from "../components/inputs/InputDate";

// options
import sellersOptions from "../assets/json/options/sellersOptions";
import statesOptions from "../assets/json/options/statesOptions";
import carriersOptions from "../assets/json/options/carriersOptions";

// table options
import tableOptions from "../assets/json/table_options/invoicesOptions";

// scripts
import InvoiceUtil from "../utils/Invoices";

class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastInfo: null,
      invoicesData: [],
      numInvoice: null,
      cnpj: null,
      sellerId: null,
      uf: null,
      transporter: null,
      issueDate: [null, null],
    };
  }
  static token = localStorage.getItem("token");

  async getInvoices() {
    const filters = {
      numInvoice: this.state.numInvoice || null,
      cnpj: this.state.cnpj || null,
      sellerId: this.state.sellerId || null,
      uf: this.state.uf || null,
      transporter: this.state.transporter || null,
      initialDate: this.state.issueDate[0] || null,
      finalDate: this.state.issueDate[1] || null,
    };

    console.log(filters);

    const response = await InvoiceUtil.getInvoices({
      token: this.token,
      filters,
    });

    console.log(response);

    if (response.success) {
      this.setState({ invoicesData: response.data });
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={() => this.getInvoices()}>
            <InputText
              label="Número da Nota"
              value={this.state.numInvoice}
              onChange={(value) => this.setState({ numInvoice: value })}
            />
            <InputText
              label="CNPJ"
              value={this.state.cnpj}
              onChange={(value) => this.setState({ cnpj: value })}
            />
            <InputDate
              label="Data de Emissão"
              value={this.state.issueDate}
              onChange={(value) => this.setState({ issueDate: value })}
            />
            <Select
              label="Vendedor"
              value={this.state.sellerId}
              onChange={(value) => this.setState({ sellerId: value })}
              options={sellersOptions}
            />
            <Select
              label="Estado"
              value={this.state.uf}
              onChange={(value) => this.setState({ uf: value })}
              options={statesOptions}
              search
            />
            <Select
              label="Transportadora"
              value={this.state.transporter}
              onChange={(value) => this.setState({ transporter: value })}
              options={carriersOptions}
            />
          </SideBar>
          <Content title="Notas Fiscais">
            <Table datas={this.state.invoicesData} options={tableOptions} />
          </Content>
        </div>
      </>
    );
  }
}

export default Invoices;
