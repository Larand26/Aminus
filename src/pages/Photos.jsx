import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Card from "../components/misc/Card";

// buttons
import ActionButtons from "../components/buttons/ActionButtons";
import Button from "../components/buttons/Button";

// inputs
import InputText from "../components/inputs/InputText";
import InputCheckBox from "../components/inputs/InputCheckBox";

// popups
import EditPhotoPopup from "../components/popups/PopupEditPhoto";

// styles
import "../styles/pages/photos.css";

// sem imagem
import unknown from "../assets/img/unknown.jpg";

// scripts
import PhotoUtil from "../utils/Photo";

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsData: [],
      manufacturerCode: null,
      colorCode: null,

      filterText: "",
      filteredProducts: [],

      productsSelectedForDownload: [],

      isEditPopupOpen: false,
      selectedEditProduct: null,
    };
  }

  static token = localStorage.getItem("token");

  getPhotos = async () => {
    const filters = {
      manufacturer: this.state.manufacturerCode,
      color: this.state.colorCode,
    };

    const response = await PhotoUtil.getPhotos({
      token: this.token,
      filters,
    });

    if (response.success) {
      this.setState({ productsData: response.data });
      this.setState({ filteredProducts: response.data });
    } else {
      console.log(response.error);
    }
  };

  updatePhoto = async (newProduct, oldProduct) => {
    const response = await PhotoUtil.updatePhoto({
      token: this.token,
      oldProduct,
      newProduct,
    });
  };

  onFilterChange = (value) => {
    this.setState({ filterText: value });

    const filtered = this.state.productsData.filter((product) => {
      const refMatch = product.referencia
        .toLowerCase()
        .includes(value.toLowerCase());
      const colorNameMatch = product.nome_cor
        .toLowerCase()
        .includes(value.toLowerCase());
      const colorCodeMatch = product.codigo_cor
        .toLowerCase()
        .includes(value.toLowerCase());
      return refMatch || colorNameMatch || colorCodeMatch;
    });

    this.setState({ filteredProducts: filtered });
  };

  onChangeSelectedForDownload = (product) => {
    const { productsSelectedForDownload } = this.state;
    const isSelected = productsSelectedForDownload.includes(product);
    if (isSelected) {
      this.setState({
        productsSelectedForDownload: productsSelectedForDownload.filter(
          (p) => p !== product,
        ),
      });
    } else {
      this.setState({
        productsSelectedForDownload: [...productsSelectedForDownload, product],
      });
    }
  };

  onChangeSelectAllForDownload = () => {
    const { productsSelectedForDownload, filteredProducts } = this.state;
    const allSelected = filteredProducts.every((product) =>
      productsSelectedForDownload.includes(product),
    );
    if (allSelected) {
      this.setState({ productsSelectedForDownload: [] });
    } else {
      this.setState({ productsSelectedForDownload: filteredProducts });
    }
  };

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar onSearch={this.getPhotos}>
            <InputText
              label="Código de fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
            />
            <InputText
              label="Código da cor"
              value={this.state.colorCode}
              onChange={(value) => this.setState({ colorCode: value })}
            />
          </SideBar>
          <Content title="Fotos">
            <div className="filter-actions">
              <InputText
                className="filter-input"
                value={this.state.filterText}
                onChange={(value) => this.onFilterChange(value)}
              />
              <InputCheckBox
                checked={this.state.filteredProducts.every((product) =>
                  this.state.productsSelectedForDownload.includes(product),
                )}
                onChange={this.onChangeSelectAllForDownload}
              />
              <Button
                className="download-btn"
                text="Baixar"
                icon="fa fa-download"
              />
            </div>
            <div className="fotos-container">
              {this.state.filteredProducts.map((product) => (
                <Card
                  photo={product.fotos[0] || unknown}
                  onClick={() => this.onChangeSelectedForDownload(product)}
                  className={
                    this.state.productsSelectedForDownload.includes(product)
                      ? "hover-card card-selected"
                      : "hover-card"
                  }
                >
                  <p className="ref">{product.referencia}</p>
                  <p className="color-name">{product.nome_cor}</p>
                  <p className="color-code">{product.codigo_cor}</p>
                  <ActionButtons
                    onEdit={() => {
                      this.setState({
                        isEditPopupOpen: true,
                        selectedEditProduct: product,
                      });
                    }}
                    onDelete={() => console.log("Excluir", product)}
                    onDownload={() => console.log("Baixar", product)}
                  />
                </Card>
              ))}
            </div>
          </Content>
          <EditPhotoPopup
            isOpen={this.state.isEditPopupOpen}
            onClose={(data) => {
              this.updatePhoto(data, this.state.selectedEditProduct);
              this.setState({
                isEditPopupOpen: false,
                selectedEditProduct: null,
              });
            }}
            product={this.state.selectedEditProduct}
          />
        </div>
      </>
    );
  }
}

export default Photos;
