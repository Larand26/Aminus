import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";

// inputs
import InputText from "../components/inputs/InputText";
import InputButton from "../components/inputs/InputButton";

// buttons
import ButtonTypeGender from "../components/buttons/ButtonTypeGender";
import Button from "../components/buttons/Button";

// tabela
import Table from "../components/table/Table";

// table-options
import tableOptions from "../assets/json/table_options/sizesOptions";

// styles
import "../styles/pages/web-registration.css";

// sem imagem
import unknown from "../assets/img/unknown.jpg";

class WebRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturerCode: "",
      productCode: "",
    };
  }
  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar>
            <InputText
              label="Código do Fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
            />
            <InputText
              label="Código do Produto"
              value={this.state.productCode}
              onChange={(value) => this.setState({ productCode: value })}
            />
          </SideBar>
          <Content>
            <div className="infos">
              <div className="type-gen-container">
                <div>
                  <ButtonTypeGender icon="icon-male" />
                  <ButtonTypeGender icon="icon-female" />
                  <ButtonTypeGender icon="icon-child" />
                  <ButtonTypeGender icon="icon-baby" />
                  <ButtonTypeGender icon="icon-unisex" />
                  <ButtonTypeGender icon="fa fa-promo" />
                </div>
                <div>
                  <ButtonTypeGender icon="icon-chinelo" />
                  <ButtonTypeGender icon="icon-slide" />
                  <ButtonTypeGender icon="icon-sandalia" />
                  <ButtonTypeGender icon="icon-tamanco" />
                  <ButtonTypeGender icon="icon-rasteira" />
                  <ButtonTypeGender icon="icon-bota" />
                  <ButtonTypeGender icon="icon-babuche" />
                  <ButtonTypeGender icon="icon-sapatilha" />
                  <ButtonTypeGender icon="icon-sapato" />
                </div>
              </div>
              <div className="display-container">
                <div>
                  <div className="infos-content">
                    <p className="title-infos">Nome</p>
                    <p className="res">
                      CHINELO FEMININO INPANEMA CLÁSSICA - 06466
                    </p>
                    <hr />
                    <p className="title-infos">Pai</p>
                    <p className="res">06466-GREN-PAI</p>
                    <Button
                      text="Cadastrar"
                      className="btn-cadastrar"
                      icon="fa fa-plus"
                    />
                  </div>
                  <div className="foto-container">
                    <div className="foto-content">
                      <img src={unknown} alt="Imagem não disponível" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="display-container display-container-2">
                <div>
                  <InputText />
                  <InputButton icon="fa fa-plus" />
                  <Table options={tableOptions} search={false} />
                </div>
              </div>
            </div>
          </Content>
        </div>
      </>
    );
  }
}

export default WebRegistration;
