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
import tableOpitions from "../assets/json/table_options/invoicesOptions";

class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastInfo: null,
      invoicesData: [],
      invoiceId: null,
      sellerId: null,
      state: null,
      carrier: null,
      issueDate: [null, null],
    };
  }
  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar>
            <InputText
              label="Número da Nota"
              value={this.state.invoiceId}
              onChange={(value) => this.setState({ invoiceId: value })}
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
              value={this.state.state}
              onChange={(value) => this.setState({ state: value })}
              options={statesOptions}
            />
            <Select
              label="Transportadora"
              value={this.state.carrier}
              onChange={(value) => this.setState({ carrier: value })}
              options={carriersOptions}
            />
          </SideBar>
          <Content title="Notas Fiscais">
            <Table datas={this.state.invoicesData} options={tableOpitions} />
          </Content>
        </div>
      </>
    );
  }
}

export default Invoices;
