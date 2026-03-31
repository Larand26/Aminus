import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Toast from "../components/misc/Toast";

// inputs
import InputText from "../components/inputs/InputText";
import Select from "../components/inputs/Select";

// options
import sellersOptions from "../assets/json/options/selerAminusOptions";

// scripts
import WhatsappUtil from "../utils/Whatsapp.js";

// pages
import MessagesPage from "../components/whatsapp/MessagesPage";

const pageOptions = [
  {
    name: "Mensagens",
    icon: "fa-brands fa-whatsapp",
    onClick: () => {},
  },
];

class Whatsapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "messages",

      token: localStorage.getItem("token") || null,
      user: JSON.parse(localStorage.getItem("user")) || null,

      cellphoneNumber: "",
      name: "",
      sellerId: "",
      sellerName: "",

      photos: [],
      message: "",
      contactsData: [],
      contactsSelected: [],

      toastInfo: null,
    };
  }

  handleGetContacts = async () => {
    const filters = {
      cellphoneNumber: this.state.cellphoneNumber,
      name: this.state.name,
      sellerId: this.state.sellerId,
      sellerName: this.state.sellerName,
    };
    const response = await WhatsappUtil.getContacts({
      token: this.state.token,
      filters: filters,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error || "Erro ao buscar contatos.",
          type: "erro",
        },
      });
      return;
    }

    if (response.success && response.data) {
      this.setState({ contactsData: response.data });
    }
  };

  // Altera itens selecionados na tabela
  handleSelectionChange = (items) => {
    if (Array.isArray(items)) {
      this.setState({ contactsSelected: items });
    } else {
      this.setState((prevState) => ({
        contactsSelected: prevState.contactsSelected.includes(items)
          ? prevState.contactsSelected.filter((item) => item !== items)
          : [...prevState.contactsSelected, items],
      }));
    }
  };

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
          <SideBar onSearch={this.handleGetContacts}>
            <InputText
              label="Telefone"
              value={this.state.cellphoneNumber}
              onChange={(value) => this.setState({ cellphoneNumber: value })}
            />
            <InputText
              label="Nome do Contato"
              value={this.state.name}
              onChange={(value) => this.setState({ name: value })}
            />
            <Select
              label="Vendedor"
              options={sellersOptions}
              value={this.state.sellerId}
              onChange={(value) => this.setState({ sellerId: value })}
            />
          </SideBar>
          <Content title="Whatsapp" pages={pageOptions}>
            {this.state.page === "messages" && (
              <MessagesPage
                photos={this.state.photos}
                onChangePhotos={(photos) => this.setState({ photos })}
                message={this.state.message}
                onChangeMessage={(message) => this.setState({ message })}
                contactsData={this.state.contactsData}
                contactsSelected={this.state.contactsSelected}
                onSelectionChange={(data) => this.handleSelectionChange(data)}
              />
            )}
          </Content>
        </div>
      </>
    );
  }
}

export default Whatsapp;
