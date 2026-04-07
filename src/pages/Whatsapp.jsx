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
import ContactsPage from "../components/whatsapp/ContactsPage";
import ConfigurationPage from "../components/whatsapp/ConfigurationPage";

class Whatsapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "messages",

      loadingGetContacts: false,

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

      session: { isOpen: false, isConnected: false },
      qrCode: null,

      toastInfo: null,
    };
  }

  pageOptions = [
    {
      name: "Mensagens",
      icon: "fa-brands fa-whatsapp",
      onClick: () => {
        this.setState({ page: "messages" });
      },
    },
    {
      name: "Contatos",
      icon: "fa fa-phone-flip",
      onClick: () => {
        this.setState({ page: "contacts" });
      },
    },
    {
      name: "Configurações",
      icon: "fa-solid fa-gear",
      onClick: () => {
        this.setState({ page: "configurations" });
      },
    },
  ];

  handleGetContacts = async () => {
    const filters = {
      cellphoneNumber: this.state.cellphoneNumber,
      name: this.state.name,
      sellerId: this.state.sellerId,
      sellerName: this.state.sellerName,
    };

    this.setState({ loadingGetContacts: true });

    const response = await WhatsappUtil.getContacts({
      token: this.state.token,
      filters: filters,
    });

    this.setState({ loadingGetContacts: false });

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

  // Salva alterações de contato editado
  handleSaveEditedContact = async (contactData) => {
    const response = await WhatsappUtil.saveEditedContact({
      token: this.state.token,
      contactData,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error || "Erro ao salvar contato.",
          type: "falha",
        },
      });
      return;
    }

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Contato salvo com sucesso.",
        type: "sucesso",
      },
    });

    // Recarregar contatos para atualizar dados na tabela
    this.handleGetContacts();
  };

  // Exclui contato selecionado
  handleDeleteContact = async (contactData) => {
    // Implementar lógica de exclusão de contato aqui
    const response = await WhatsappUtil.deleteContact({
      token: this.state.token,
      contactId: contactData.CONTATO_ID,
    });

    console.log(response);

    // Após exclusão, recarregar contatos para atualizar tabela
    this.handleGetContacts();
  };

  // Cria um novo contato com os dados preenchidos nos inputs
  handleAddContact = async (contactData) => {
    const response = await WhatsappUtil.addContact({
      token: this.state.token,
      contactData,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error || "Erro ao adicionar contato.",
          type: "falha",
        },
      });
      return;
    }

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Contato adicionado com sucesso.",
        type: "sucesso",
      },
    });

    // Recarregar contatos para mostrar novo contato na tabela
    this.handleGetContacts();
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

  // Inicia a sessão do Whatsapp
  handleStartSession = async () => {
    const response = await WhatsappUtil.startSession({
      token: this.state.token,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error || "Erro ao iniciar sessão.",
          type: "falha",
        },
      });
      return;
    }

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Sessão iniciada com sucesso.",
        type: "sucesso",
      },
      session: {
        isOpen: response?.data?.isOpen || false,
        isConnected: response?.data?.isConnected || false,
      },
      qrCode: response?.data?.qrcode || null,
    });
  };

  // Encerra a sessão do Whatsapp
  handleCloseSession = async () => {
    const response = await WhatsappUtil.closeSession({
      token: this.state.token,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error || "Erro ao fechar sessão.",
          type: "falha",
        },
      });
      return;
    }

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Sessão fechada com sucesso.",
        type: "sucesso",
      },
      session: { isOpen: false, isConnected: false },
      qrCode: null,
    });
  };

  // Envia mensagens para os contatos selecionados
  handleSendMessages = async () => {
    const response = await WhatsappUtil.sendMessages({
      token: this.state.token,
      contacts: this.state.contactsSelected,
      message: this.state.message,
      photos: this.state.photos,
    });

    console.log(response);
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
          <Content title="Whatsapp" pages={this.pageOptions}>
            {this.state.page === "messages" && (
              <MessagesPage
                photos={this.state.photos}
                onChangePhotos={(photos) => this.setState({ photos })}
                message={this.state.message}
                onChangeMessage={(message) => this.setState({ message })}
                contactsData={this.state.contactsData}
                contactsSelected={this.state.contactsSelected}
                onSelectionChange={(data) => this.handleSelectionChange(data)}
                onSendMessages={this.handleSendMessages}
              />
            )}
            {this.state.page === "contacts" && (
              <ContactsPage
                contactsData={this.state.contactsData}
                onSave={(contactData) =>
                  this.handleSaveEditedContact(contactData)
                }
                loading={this.state.loadingGetContacts}
                onDelete={(contactId) => this.handleDeleteContact(contactId)}
                onAdd={(contactData) => this.handleAddContact(contactData)}
              />
            )}
            {this.state.page === "configurations" && (
              <ConfigurationPage
                session={this.state.session}
                qrCode={this.state.qrCode}
                sessionActions={{
                  startSession: this.handleStartSession,
                  generateQRCode: this.handleStartSession,
                  logout: this.handleCloseSession,
                }}
              />
            )}
          </Content>
        </div>
      </>
    );
  }
}

export default Whatsapp;
