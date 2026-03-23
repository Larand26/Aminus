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

// Popups
import PopUpSearchDateReservation from "../components/popups/PopUpSearchDateReservation";

// scripts
import ProductUtil from "../utils/Product";

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

      isSearchDatePopupOpen: false,
      selectedItem: null,
      responseDateReservation: null,
    };
  }

  static token = localStorage.getItem("token");

  async getProductReservations() {
    const filters = {
      productCode: this.state.productCode || null,
      manufacturerCode: this.state.manufacturerCode || null,
      orderCode: this.state.orderNumber || null,
      clientName: this.state.clientName || null,
      sellerId: this.state.sellerId || null,
    };

    const response = await ProductUtil.getProductReservations({
      token: this.token,
      filters,
    });

    if (response.success) {
      this.setState({ reservationsData: response.data });
    }
  }

  async getDateReservation() {
    const { selectedItem } = this.state;

    const filters = {
      initialDate: selectedItem?.reservationDate[0] || null,
      finalDate: selectedItem?.reservationDate[1] || null,
      productCode: selectedItem?.COD_INTERNO || null,
      orderCode: selectedItem?.NUM_PEDIDO || null,
    };

    const response = await ProductUtil.getDateReservation({
      token: this.token,
      filters,
    });

    if (response.success && response.data && response.data.length > 0) {
      this.setState({ responseDateReservation: response.data[0].DATA });
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <PopUpSearchDateReservation
          response={this.state.responseDateReservation}
          isOpen={this.state.isSearchDatePopupOpen}
          onClose={() => this.setState({ isSearchDatePopupOpen: false })}
          onSearch={() => {
            this.getDateReservation();
          }}
          dateValue={this.state.selectedItem?.reservationDate || ""}
          onChangeDate={(value) => {
            this.setState((prevState) => ({
              selectedItem: {
                ...prevState.selectedItem,
                reservationDate: value,
              },
            }));
          }}
          data={this.state.selectedItem}
        />
        <div className="main-container">
          <SideBar onSearch={() => this.getProductReservations()}>
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
            <Table
              datas={this.state.reservationsData}
              options={tableOptions}
              hover
              onClickRow={(data) => {
                this.setState({ isSearchDatePopupOpen: true });
                this.setState({ selectedItem: data });
              }}
            />
          </Content>
        </div>
      </>
    );
  }
}

export default Reservation;
