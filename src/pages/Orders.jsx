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

// table options
import tableOptions from "../assets/json/table_options/ordersOptions";

class Orders extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar>
            <InputText label="Num Pedido" name="orderId" />
            <InputDate label="Data do Pedido" name="orderDate" />
            <InputText label="Razão Social" name="companyName" />
            <InputText label="CNPJ" name="cnpj" />
            <Select label="Vendedor" name="seller" options={sellersOptions} />
          </SideBar>
          <Content title="Pedidos">
            <Table options={tableOptions} />
          </Content>
        </div>
      </>
    );
  }
}

export default Orders;
