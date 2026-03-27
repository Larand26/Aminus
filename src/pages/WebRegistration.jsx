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
import sizesOptions from "../assets/json/table_options/sizesOptions";
import tableOptions from "../assets/json/table_options/webRegistrationOptions";

// styles
import "../styles/pages/web-registration.css";

// sem imagem
import unknown from "../assets/img/unknown.jpg";

// scripts
import ProductUtil from "../utils/Product";
import Formatter from "../utils/Formatter";
import PhotoUtil from "../utils/Photo";

class WebRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsData: [],
      manufacturerCode: "",
      productCode: "",

      colors: [],

      selectedRow: null,
      gender: null,
      promo: false,
      type: null,
      slipperSizeRange: [],
      newColor: "",
      descriptionProduct: "",
      manufacturer: "",
      photos: [],

      selectedItems: [],
    };
  }

  static token = localStorage.getItem("token") || "";

  getProductRegistrations = async () => {
    const filters = {
      manufacturer: this.state.manufacturerCode,
      productCode: this.state.productCode,
    };
    const response = await ProductUtil.getProductRegistrations({
      token: WebRegistration.token,
      filters,
    });
    if (response.success) {
      this.setState({ productsData: response.data });
      await this.getColors(response.data);
      this.formatSelectedProductData(response.data[0]);
    }
  };

  setActiveClickItemIndex(data) {
    const { COD_INTERNO } = data;
    if (!COD_INTERNO) return;
    const updatedData = this.state.productsData.map((item) => {
      if (item.COD_INTERNO === COD_INTERNO) {
        return {
          ...item,
          ATIVO_ECOMMERCE: !item.ATIVO_ECOMMERCE,
          INTEGRACAO_ECOMMERCE: !item.ATIVO_ECOMMERCE,
        };
      }
      return item;
    });
    this.setState({ productsData: updatedData });
  }

  setColorChange(data) {
    const { COD_INTERNO } = data;
    if (!COD_INTERNO) return;
    const updatedData = this.state.productsData.map((item) => {
      if (item.COD_INTERNO === COD_INTERNO) {
        item = data;
      }
      return item;
    });
    this.setState({ productsData: updatedData });
  }

  getColors = async (productsData) => {
    const response = await ProductUtil.getColors({
      token: WebRegistration.token,
      filters: {},
    });
    if (response.success) {
      this.setState({ colors: response.data });
    }
  };

  createColor = async () => {
    const response = await ProductUtil.createColor({
      token: WebRegistration.token,
      colorName: this.state.newColor,
    });
    if (response.success) {
      this.getColors();
    }
  };

  formatSelectedProductData(data) {
    this.setState({ selectedRow: data });
    this.getPhotos(data);
    const formattedData = Formatter.formatProductData(data);
    const {
      gender,
      type,
      promo,
      slipperSizeRange,
      descriptionProduct,
      manufacturer,
      newColor,
    } = formattedData;

    this.setState({
      slipperSizeRange,
      gender,
      type,
      promo,
      descriptionProduct,
      manufacturer,
      newColor,
    });
  }

  getPhotos = async (data) => {
    const filters = {
      manufacturer: data.COD_FABRICANTE,
      color: data.COD_COR,
    };
    const response = await PhotoUtil.getPhotos({
      token: WebRegistration.token,
      filters,
    });
    if (response.success) {
      console.log(response.data);
      this.setState({ photos: response.data[0].fotos });
    }
  };

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
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={this.getProductRegistrations}>
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
                  <ButtonTypeGender
                    icon="icon-male"
                    key={"MASCULINO"}
                    className={`${this.state.gender === "MASCULINO" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ gender: "MASCULINO" })}
                  />
                  <ButtonTypeGender
                    icon="icon-female"
                    key={"FEMININO"}
                    className={`${this.state.gender === "FEMININO" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ gender: "FEMININO" })}
                  />
                  <ButtonTypeGender
                    icon="icon-child"
                    key={"INFANTIL"}
                    className={`${this.state.gender === "INFANTIL" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ gender: "INFANTIL" })}
                  />
                  <ButtonTypeGender
                    icon="icon-baby"
                    key={"BABY"}
                    className={`${this.state.gender === "BABY" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ gender: "BABY" })}
                  />
                  <ButtonTypeGender
                    icon="icon-unisex"
                    key={"UNISEX"}
                    className={`${this.state.gender === "UNISEX" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ gender: "UNISEX" })}
                  />
                  <ButtonTypeGender
                    icon="fa fa-promo"
                    key={"PROMO"}
                    className={`${this.state.promo ? "selected promotion" : ""}`}
                    onClick={(data) =>
                      this.setState({ promo: !this.state.promo })
                    }
                  />
                </div>
                <div>
                  <ButtonTypeGender
                    icon="icon-chinelo"
                    key={"CHINELO"}
                    className={`${this.state.type === "CHINELO" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "CHINELO" })}
                  />
                  <ButtonTypeGender
                    icon="icon-slide"
                    key={"CHINELO SLIDE"}
                    className={`${this.state.type === "CHINELO SLIDE" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "CHINELO SLIDE" })}
                  />
                  <ButtonTypeGender
                    icon="icon-sandalia"
                    key={"SANDALIA"}
                    className={`${this.state.type === "SANDALIA" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "SANDALIA" })}
                  />
                  <ButtonTypeGender
                    icon="icon-tamanco"
                    key={"TAMANCO"}
                    className={`${this.state.type === "TAMANCO" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "TAMANCO" })}
                  />
                  <ButtonTypeGender
                    icon="icon-rasteira"
                    key={"RASTEIRA"}
                    className={`${this.state.type === "RASTEIRA" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "RASTEIRA" })}
                  />
                  <ButtonTypeGender
                    icon="icon-bota"
                    key={"BOTA"}
                    className={`${this.state.type === "BOTA" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "BOTA" })}
                  />
                  <ButtonTypeGender
                    icon="icon-babuche"
                    key={"BABUACHE"}
                    className={`${this.state.type === "BABUACHE" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "BABUACHE" })}
                  />
                  <ButtonTypeGender
                    icon="icon-sapatilha"
                    key={"SAPATILHA"}
                    className={`${this.state.type === "SAPATILHA" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "SAPATILHA" })}
                  />
                  <ButtonTypeGender
                    icon="icon-sapato"
                    key={"SAPATO"}
                    className={`${this.state.type === "SAPATO" ? "selected" : ""}`}
                    onClick={(data) => this.setState({ type: "SAPATO" })}
                  />
                </div>
              </div>
              <div className="display-container">
                <div>
                  <div className="infos-content">
                    <p className="title-infos">Nome</p>
                    <p
                      className={`res ${!this.state.descriptionProduct ? "placeholder" : ""}`}
                    >
                      {this.state.descriptionProduct
                        ? `${this.state.type} ${this.state.gender} ${this.state.descriptionProduct}`
                        : "Selecione um produto para ver as informações"}
                    </p>
                    <hr />
                    <p className="title-infos">Pai</p>
                    <p
                      className={`res ${!this.state.descriptionProduct ? "placeholder" : ""}`}
                    >
                      {this.state.descriptionProduct
                        ? `${this.state.manufacturer || ""}-${!this.state.promo ? "GREN" : "PROMO"}-PAI`
                        : "Selecione um produto para ver as informações"}
                    </p>
                    <Button
                      text="Cadastrar"
                      className="btn-cadastrar"
                      icon="fa fa-plus"
                    />
                  </div>
                  <div className="foto-container">
                    <div className="foto-content">
                      <img
                        src={this.state.photos[0] || unknown}
                        alt="Imagem não disponível"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="display-container display-container-2">
                <div>
                  <InputText
                    value={this.state.descriptionProduct}
                    onChange={(value) =>
                      this.setState({ descriptionProduct: value })
                    }
                  />
                  <InputButton
                    icon="fa fa-plus"
                    value={this.state.newColor}
                    onChange={(value) => this.setState({ newColor: value })}
                  />
                  <Table
                    options={sizesOptions}
                    datas={this.state.slipperSizeRange}
                    search={false}
                  />
                </div>
              </div>
            </div>
            <Table
              options={tableOptions}
              datas={this.state.productsData}
              search={false}
              onActiveChange={(data) => this.setActiveClickItemIndex(data)}
              optionsSelect={this.state.colors}
              onChangeSelect={(data) => this.setColorChange(data)}
              onClickRow={(data) => this.formatSelectedProductData(data)}
              rowSelected={{
                value: this.state.selectedRow?.COD_INTERNO,
                key: "COD_INTERNO",
              }}
              hover
              selectedItems={this.state.selectedItems}
              onSelectionChange={this.handleSelectionChange}
            />
          </Content>
        </div>
      </>
    );
  }
}

export default WebRegistration;
