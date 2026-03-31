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

      photos: [],
      message: "",
      contactsData: [],
      contactsSelected: [],

      toastInfo: null,
    };
  }

  // Altera itens selecionados na tabela
  handleSelectionChange = (items) => {
    if (Array.isArray(items)) {
      this.setState({ selectedItems: items });
    } else {
      this.setState((prevState) => ({
        selectedItems: prevState.selectedItems.includes(items)
          ? prevState.selectedItems.filter((item) => item !== items)
          : [...prevState.selectedItems, items],
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
          <SideBar>
            <InputText label="Telefone" />
            <InputText label="Nome do Contato" />
            <Select label="Vendedor" options={sellersOptions} />
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
                onSelectionChange={this.handleSelectionChange}
              />
            )}
          </Content>
        </div>
      </>
    );
  }
}

export default Whatsapp;
