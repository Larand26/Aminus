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

// table
import Table from "../components/table/Table";

// options
import sellersOptions from "../assets/json/options/selerAminusOptions";

class Whatsapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastInfo: null,
    };
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
          <SideBar>
            <InputText label="Telefone" />
            <InputText label="Nome do Contato" />
            <Select label="Vendedor" options={sellersOptions} />
          </SideBar>
          <Content title="Whatsapp"></Content>
        </div>
      </>
    );
  }
}

export default Whatsapp;
