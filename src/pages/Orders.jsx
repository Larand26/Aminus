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

// buttons
import Button from "../components/buttons/Button";

// options
import sellersOptions from "../assets/json/options/sellersOptions";

// table options
import tableOptions from "../assets/json/table_options/ordersOptions";
import ordersItemsOptions from "../assets/json/table_options/orderItemsOptions";

// scripts
import OrderUtil from "../utils/Order";

// styles
import "../styles/pages/orders.css";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "orders",

      ordersData: [],
      numOrder: null,
      client: null,
      cnpj: null,
      sellerId: null,
      issueDate: [null, null],

      selectedOrderData: [],
      selectItemOrder: [],
    };
  }

  static token = localStorage.getItem("token");

  async getOrders() {
    const filters = {
      numOrder: this.state.numOrder,
      initialDate: this.state.issueDate[0],
      finalDate: this.state.issueDate[1],
      client: this.state.client,
      cnpj: this.state.cnpj,
      sellerId: this.state.sellerId,
    };

    const response = await OrderUtil.getOrders({ token: this.token, filters });
    if (response.success) {
      this.setState({ ordersData: response.data });
    }
  }

  async getOrderItems(data) {
    const orderId = data.NUM_PEDIDO || null;
    const response = await OrderUtil.getOrderItems({
      token: this.token,
      orderId,
    });
    if (response.success) {
      this.setState({ selectedOrderData: response.data });
      // item mais pesado
      const heaviestItem = response.data.reduce((prev, current) => {
        return prev.PESO_BRUTO > current.PESO_BRUTO ? prev : current;
      });
      this.setState({ selectItemOrder: [heaviestItem] });
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={() => this.getOrders()}>
            <InputText
              label="Num Pedido"
              name="orderId"
              value={this.state.numOrder}
              onChange={(e) => this.setState({ numOrder: e.target.value })}
            />
            <InputDate
              label="Data de Emissão"
              value={this.state.issueDate}
              onChange={(value) => this.setState({ issueDate: value })}
            />
            <InputText
              label="Razão Social"
              name="companyName"
              value={this.state.client}
              onChange={(e) => this.setState({ client: e.target.value })}
            />
            <InputText
              label="CNPJ"
              name="cnpj"
              value={this.state.cnpj}
              onChange={(e) => this.setState({ cnpj: e.target.value })}
            />
            <Select
              label="Vendedor"
              name="seller"
              options={sellersOptions}
              value={this.state.sellerId}
              onChange={(e) => this.setState({ sellerId: e.target.value })}
            />
          </SideBar>
          <Content title="Pedidos">
            {this.state.page == "orders" && (
              <Table
                options={tableOptions}
                datas={this.state.ordersData}
                hover
                onClickRow={(data) => {
                  this.getOrderItems(data);
                  this.setState({ page: "orderItems" });
                }}
              />
            )}
            {this.state.page == "orderItems" && (
              <>
                <Table
                  options={ordersItemsOptions}
                  datas={this.state.selectedOrderData}
                  onSelectionChange={(data) => {
                    this.setState({
                      selectItemOrder: [data],
                    });
                  }}
                  selectedItems={this.state.selectItemOrder}
                />
                <div className="buttons-container">
                  <Button
                    text="Cotação"
                    icon="fa fa-truck"
                    className="btn-orders"
                  />
                  <Button
                    text="Cubagem"
                    icon="fa fa-box"
                    className="btn-orders"
                  />
                </div>
              </>
            )}
          </Content>
        </div>
      </>
    );
  }
}

export default Orders;
