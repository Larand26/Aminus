import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Toast from "../components/misc/Toast";

// inputs
import InputText from "../components/inputs/InputText";
import InputButton from "../components/inputs/InputButton";
import InputCheckBox from "../components/inputs/InputCheckBox";
import InputSelect from "../components/inputs/Select";

// buttons
import ButtonTypeGender from "../components/buttons/ButtonTypeGender";
import Button from "../components/buttons/Button";

// tabela
import TableColumn from "../components/table/TableColumn";
import Table from "../components/table/Table";
import Column from "../components/table/Column";

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

      token: localStorage.getItem("token") || null,

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

      loading: false,

      toastInfo: null,
    };
  }

  getProductRegistrations = async () => {
    const filters = {
      manufacturer: this.state.manufacturerCode,
      productCode: this.state.productCode,
    };
    this.setState({ selectedItems: [] });
    this.setState({ loading: true });
    const response = await ProductUtil.getProductRegistrations({
      token: this.state.token,
      filters,
    });
    this.setState({ loading: false });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao buscar os produtos. Tente novamente.",
          type: "falha",
        },
      });
      return;
    }

    if (response.success && response.data.length === 0) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Nenhum produto encontrado com os filtros selecionados.",
          type: "aviso",
        },
      });
      return;
    }

    this.setState({ productsData: response.data });
    await this.getColors(response.data);
    this.formatSelectedProductData(response.data[0]);
  };

  onKeyPressGetProductRegistrations = (e) => {
    if (e.key === "Enter") {
      this.getProductRegistrations();
    }
  };

  setActiveClickItemIndex(value, codInterno) {
    if (Array.isArray(codInterno)) {
      // Usa Set para busca O(1) em arrays grandes
      const codSet = new Set(codInterno);
      this.setState((prevState) => {
        const updatedData = prevState.productsData.map((item) => {
          if (codSet.has(item.COD_INTERNO)) {
            return {
              ...item,
              ATIVO_ECOMMERCE: value,
              INTEGRACAO_ECOMMERCE: value,
            };
          }
          return item;
        });
        return { productsData: updatedData };
      });
    } else {
      this.setState((prevState) => {
        const index = prevState.productsData.findIndex(
          (item) => item.COD_INTERNO === codInterno,
        );
        if (index === -1) return null;
        const updatedData = [...prevState.productsData];
        updatedData[index] = {
          ...updatedData[index],
          ATIVO_ECOMMERCE: value,
          INTEGRACAO_ECOMMERCE: value,
        };
        return { productsData: updatedData };
      });
    }
  }

  setColorChange(value, rowData) {
    const { COD_INTERNO } = rowData;
    this.setState((prevState) => {
      const index = prevState.productsData.findIndex(
        (item) => item.COD_INTERNO === COD_INTERNO,
      );
      if (index === -1) return null;
      const updatedData = [...prevState.productsData];
      updatedData[index] = { ...updatedData[index], COD_COR_ECOMMERCE: value };
      return { productsData: updatedData };
    });
  }

  getColors = async (productsData) => {
    const response = await ProductUtil.getColors({
      token: this.state.token,
      filters: {},
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao buscar as cores. Tente novamente.",
          type: "falha",
        },
      });
      return;
    }

    if (response.success && response.data.length === 0) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Nenhuma cor encontrada com os filtros selecionados.",
          type: "aviso",
        },
      });
      return;
    }

    this.setState({ colors: response.data });
  };

  createColor = async () => {
    const response = await ProductUtil.createColor({
      token: this.state.token,
      colorName: this.state.newColor,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao criar a cor. Tente novamente.",
          type: "falha",
        },
      });
      return;
    }

    if (response.success) {
      this.getColors();
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Cor criada com sucesso.",
          type: "sucesso",
        },
      });
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
      token: this.state.token,
      filters,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao buscar as fotos. Tente novamente.",
          type: "falha",
        },
      });
      return;
    }

    if (response.success && response.data.length === 0) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Nenhuma foto encontrada com os filtros selecionados.",
          type: "aviso",
        },
      });
      return;
    }

    this.setState({ photos: response.data[0].fotos });
  };

  handleSelectionChange = (value, codInterno) => {
    if (Array.isArray(codInterno)) {
      if (value) {
        this.setState({ selectedItems: codInterno });
      } else {
        this.setState({ selectedItems: [] });
      }
    } else {
      if (this.state.selectedItems.includes(codInterno)) {
        this.setState((prevState) => ({
          selectedItems: prevState.selectedItems.filter(
            (item) => item !== codInterno,
          ),
        }));
      } else {
        this.setState((prevState) => ({
          selectedItems: [...prevState.selectedItems, codInterno],
        }));
      }
    }
  };

  handleRegistration = async () => {
    const { selectedItems, productsData, descriptionProduct } = this.state;
    const productsToRegister = productsData.filter((item) =>
      selectedItems.includes(item.COD_INTERNO),
    );
    const response = await ProductUtil.registerProducts({
      token: this.state.token,
      products: productsToRegister,
      parentProduct: `${this.state.manufacturer}-${!this.state.promo ? "GREN" : "PROMO"}-PAI`,
      description: `${this.state.type} ${this.state.gender} ${this.state.descriptionProduct} - ${this.state.manufacturer || ""}`,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao cadastrar os produtos. Tente novamente.",
          type: "falha",
        },
      });
      return;
    }

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Produtos cadastrados com sucesso.",
        type: "sucesso",
      },
    });
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
          <SideBar onSearch={this.getProductRegistrations}>
            <InputText
              label="Código do Fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
              onKeyPress={this.onKeyPressGetProductRegistrations}
            />
            <InputText
              label="Código do Produto"
              value={this.state.productCode}
              onChange={(value) => this.setState({ productCode: value })}
              onKeyPress={this.onKeyPressGetProductRegistrations}
            />
          </SideBar>
          <Content>
            <div className="infos">
              <div className="type-gen-container">
                <div>
                  <ButtonTypeGender
                    icon="icon-male"
                    key={"MASCULINOa"}
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
                        ? `${this.state.type} ${this.state.gender} ${this.state.descriptionProduct} - ${this.state.manufacturer || ""}`
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
                      onClick={this.handleRegistration}
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
            <TableColumn
              data={this.state.productsData}
              onclickRow={(row) => this.formatSelectedProductData(row)}
            >
              <Column
                id={"ID"}
                type={"checkbox"}
                onChangeAll={(value) => {
                  this.handleSelectionChange(
                    value,
                    this.state.productsData.map((item) => item.COD_INTERNO),
                  );
                }}
                allChecked={this.state.productsData.every((item) =>
                  this.state.selectedItems.includes(item.COD_INTERNO),
                )}
                body={(rowData) => (
                  <InputCheckBox
                    checked={this.state.selectedItems.includes(
                      rowData.COD_INTERNO,
                    )}
                    onChange={() =>
                      this.handleSelectionChange(
                        this.state.selectedItems.includes(rowData.COD_INTERNO),
                        rowData.COD_INTERNO,
                      )
                    }
                  />
                )}
              />
              <Column id={"COD_INTERNO"} label={"Código Interno"} />
              <Column id={"COD_FABRICANTE"} label={"Código do Fabricante"} />
              <Column id={"PROD_DESCRICAO"} label={"Descrição"} />
              <Column
                label={"Cor"}
                body={(rowData) => (
                  <InputSelect
                    search
                    options={this.state.colors}
                    value={rowData.COD_COR_ECOMMERCE}
                    onChange={(value) => {
                      this.setColorChange(value, rowData);
                    }}
                  />
                )}
              />
              <Column
                // id
                id={"ATIVO_ECOMMERCE"}
                type={"checkbox"}
                // status da checkbox
                onChangeAll={(value) => {
                  this.setActiveClickItemIndex(
                    value,
                    this.state.productsData.map((item) => item.COD_INTERNO),
                  );
                }}
                allChecked={this.state.productsData.every(
                  (item) => item.ATIVO_ECOMMERCE && item.INTEGRACAO_ECOMMERCE,
                )}
                // corpo da checkbox
                body={(rowData) => (
                  <InputCheckBox
                    checked={
                      rowData.ATIVO_ECOMMERCE && rowData.INTEGRACAO_ECOMMERCE
                    }
                    onChange={() =>
                      this.setActiveClickItemIndex(
                        !(
                          rowData.ATIVO_ECOMMERCE &&
                          rowData.INTEGRACAO_ECOMMERCE
                        ),
                        rowData.COD_INTERNO,
                      )
                    }
                  />
                )}
              />
            </TableColumn>
          </Content>
        </div>
      </>
    );
  }
}

export default WebRegistration;
