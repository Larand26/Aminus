import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Card from "../components/misc/Card";

// buttons
import ActionButtons from "../components/buttons/ActionButtons";

// inputs
import InputText from "../components/inputs/InputText";

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
            <div className="fotos-container">
              {this.state.productsData.map((product) => (
                <Card photo={product.fotos[0] || unknown}>
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
