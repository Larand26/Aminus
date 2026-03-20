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

// options
import sellersOptions from "../assets/json/options/sellersOptions";

// table options
import tableOptions from "../assets/json/table_options/reservationsOptions";

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastInfo: null,
      reservationsData: [],
      manufacturerCode: null,
      internalCode: null,
      orderNumber: null,
      clientName: null,
      sellerId: null,
    };
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar>
            <InputText
              label="Código do fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
            />
            <InputText
              label="Código interno"
              value={this.state.internalCode}
              onChange={(value) => this.setState({ internalCode: value })}
            />
            <InputText
              label="Número do pedido"
              value={this.state.orderNumber}
              onChange={(value) => this.setState({ orderNumber: value })}
            />
            <InputText
              label="Nome do cliente"
              value={this.state.clientName}
              onChange={(value) => this.setState({ clientName: value })}
            />
            <Select
              label="Vendedor"
              value={this.state.sellerId}
              onChange={(value) => this.setState({ sellerId: value })}
              options={sellersOptions}
            />
          </SideBar>
          <Content title="Produtos reservados">
            <Table datas={this.state.reservationsData} options={tableOptions} />
          </Content>
        </div>
      </>
    );
  }
}

export default Reservation;
