import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Toast from "../components/misc/Toast";

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
import FrenetUtil from "../utils/Frenet";

// styles
import "../styles/pages/orders.css";

// popups
import PopUpFreight from "../components/popups/PopUpFreight";

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

      selectedOrder: null,
      selectedOrderData: [],
      selectItemOrder: [],

      isFreightPopupOpen: false,
      freightData: null,

      toastInfo: null,
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

    this.setState({ loading: true });
    const response = await OrderUtil.getOrders({ token: this.token, filters });
    this.setState({ loading: false });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao buscar os pedidos. Tente novamente.",
          type: "erro",
        },
      });
      return;
    }

    if (response.success && response.data.length === 0) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Nenhuma pedido encontrada com os filtros selecionados.",
          type: "aviso",
        },
      });
      return;
    }

    this.setState({ ordersData: response.data });
  }

  onKeyPressGetOrders = (e) => {
    if (e.key === "Enter") {
      this.getOrders();
    }
  };

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

  async calculateFreight() {
    this.setState({ isFreightPopupOpen: true });

    const response = await FrenetUtil.calculateFreight({
      token: this.token,
      selectedOrderData: this.state.selectedOrderData,
      selectItemOrder: this.state.selectItemOrder,
      selectedOrder: this.state.selectedOrder,
    });

    if (response.success) {
      this.setState({ freightData: response.data });
    }
  }

  async generateCubagePDF() {
    const response = await OrderUtil.generateCubagePDF({
      token: this.token,
      selectedOrderData: this.state.selectedOrderData,
    });
    console.log(response);

    if (response.success) {
      console.log("PDF gerado com sucesso:", response.data);
      // Abrir o arquivo gerado
      OrderUtil.openFile(response.data.filePath);
    } else {
      console.error("Erro ao gerar PDF:", response.error);
    }
  }

  render() {
    return (
      <>
        {this.state.toastInfo && (
          <Toast
            key={this.state.toastInfo.key}
            message={this.state.toastInfo.message}
            type={this.state.toastInfo.type}
          />
        )}
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={() => this.getOrders()}>
            <InputText
              label="Num Pedido"
              name="orderId"
              value={this.state.numOrder}
              onChange={(e) => this.setState({ numOrder: e.target.value })}
              onKeyPress={this.onKeyPressGetOrders}
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
              onKeyPress={this.onKeyPressGetOrders}
            />
            <InputText
              label="CNPJ"
              name="cnpj"
              value={this.state.cnpj}
              onChange={(e) => this.setState({ cnpj: e.target.value })}
              onKeyPress={this.onKeyPressGetOrders}
            />
            <Select
              label="Vendedor"
              name="seller"
              options={sellersOptions}
              value={this.state.sellerId}
              onChange={(e) => this.setState({ sellerId: e.target.value })}
            />
          </SideBar>
          <Content
            title="Pedidos"
            pages={
              this.state.page !== "orders"
                ? [
                    {
                      icon: "fa fa-angle-left",
                      onClick: () => {
                        this.setState({ page: "orders" });
                        this.setState({ selectedOrder: null });
                        this.setState({ selectedOrderData: [] });
                        this.setState({ selectItemOrder: [] });
                      },
                    },
                  ]
                : []
            }
          >
            {this.state.page == "orders" && (
              <Table
                options={tableOptions}
                datas={this.state.ordersData}
                hover
                onClickRow={(data) => {
                  this.getOrderItems(data);
                  this.setState({ selectedOrder: data });
                  this.setState({ page: "orderItems" });
                }}
                loading={this.state.loading}
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
                    onClick={() => this.calculateFreight()}
                  />
                  <Button
                    text="Cubagem"
                    icon="fa fa-box"
                    className="btn-orders"
                    onClick={() => this.generateCubagePDF()}
                  />
                </div>
              </>
            )}
          </Content>
          <PopUpFreight
            isOpen={this.state.isFreightPopupOpen}
            onClose={() => {
              this.setState({ isFreightPopupOpen: false });
              this.setState({ freightData: null });
            }}
            data={this.state.freightData}
          />
        </div>
      </>
    );
  }
}

export default Orders;
