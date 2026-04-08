import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Toast from "../components/misc/Toast";

// inputs
import InputText from "../components/inputs/InputText";

// popups
import EditPhotoPopup from "../components/popups/PopupEditPhoto";

// styles
import "../styles/pages/photos.css";

// pages
import Galery from "../components/photos/Galery";
import AddPhotos from "../components/photos/AddPhotos";

// scripts
import PhotoUtil from "../utils/Photo";

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "photos",

      token: localStorage.getItem("token") || null,

      productsData: [],
      manufacturerCode: "",
      colorCode: "",

      filterText: "",
      filteredProducts: [],

      productsSelectedForDownload: [],

      isEditPopupOpen: false,
      selectedEditProduct: null,

      toastInfo: null,

      newPhotos: {
        newPhotos: [{ photo: [], color: "", colorCode: "" }],
      },
    };
  }

  pageOptions = [
    {
      name: "Mensagens",
      icon: "fa fa-camera",
      onClick: () => {
        this.setState({ page: "photos" });
      },
    },
    {
      name: "Contatos",
      icon: "fa fa-plus",
      onClick: () => {
        this.setState({ page: "addPhotos" });
      },
    },
  ];

  getPhotos = async (manufacturerCode) => {
    const filters = {
      manufacturer: manufacturerCode || this.state.manufacturerCode,
      color: this.state.colorCode,
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

    this.setState({ productsData: response.data });
    this.setState({ filteredProducts: response.data });
  };

  onKeyPressGetPhotos = (e) => {
    if (e.key === "Enter") {
      this.getPhotos();
    }
  };

  updatePhoto = async (newProduct, oldProduct) => {
    const response = await PhotoUtil.updatePhoto({
      token: this.state.token,
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

  handleDownload = async (product) => {
    let response;

    if (product) {
      response = await PhotoUtil.downloadPhoto({
        token: this.state.token,
        products: [product],
      });
      return;
    }

    if (this.state.productsSelectedForDownload.length > 0)
      response = await PhotoUtil.downloadPhoto({
        token: this.token,
        products: this.state.productsSelectedForDownload,
      });

    console.log(response || "Sem resposta");
  };

  createEmptyPhotoItem = () => ({ photo: [], color: "", colorCode: "" });

  isPhotoItemComplete = (photoItem) => {
    return (
      Array.isArray(photoItem?.photo) &&
      photoItem.photo.length > 0 &&
      photoItem?.color?.trim() &&
      photoItem?.colorCode?.trim()
    );
  };

  onChangeNewPhotoItem = (index, field, value) => {
    this.setState((prevState) => {
      const currentPhotos = prevState.newPhotos?.newPhotos?.length
        ? prevState.newPhotos.newPhotos
        : [this.createEmptyPhotoItem()];

      const updatedPhotos = [...currentPhotos];
      updatedPhotos[index] = {
        ...updatedPhotos[index],
        [field]: value,
      };

      const isLastItem = index === updatedPhotos.length - 1;
      if (isLastItem && this.isPhotoItemComplete(updatedPhotos[index])) {
        updatedPhotos.push(this.createEmptyPhotoItem());
      }

      return {
        newPhotos: {
          ...prevState.newPhotos,
          newPhotos: updatedPhotos,
        },
      };
    });
  };

  handleAddNewPhotos = async () => {
    const { newPhotos } = this.state;
    const photosToAdd = newPhotos.newPhotos.filter((photoItem) =>
      this.isPhotoItemComplete(photoItem),
    );
    newPhotos.newPhotos = photosToAdd;
    const response = await PhotoUtil.createPhoto({
      token: this.state.token,
      newPhotos,
    });

    if (response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Fotos criadas com sucesso.",
          type: "sucesso",
        },
        newPhotos: {
          newPhotos: [this.createEmptyPhotoItem()],
        },
      });
      this.getPhotos(newPhotos.newManufacturerCode);
    } else {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao criar as fotos. Tente novamente.",
          type: "erro",
        },
      });
    }
  };

  handleDeletePhoto = async (product) => {
    const response = await PhotoUtil.deletePhoto({
      token: this.state.token,
      photoId: product._id,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao deletar a foto. Tente novamente.",
          type: "erro",
        },
      });
      this.getPhotos(product.referencia);
      return;
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
          <SideBar onSearch={this.getPhotos}>
            <InputText
              label="Código de fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
              onKeyPress={this.onKeyPressGetPhotos}
            />
            <InputText
              label="Código da cor"
              value={this.state.colorCode}
              onChange={(value) => this.setState({ colorCode: value })}
              onKeyPress={this.onKeyPressGetPhotos}
            />
          </SideBar>
          <Content title="Fotos" pages={this.pageOptions}>
            {this.state.page == "photos" && (
              <Galery
                filterText={this.state.filterText}
                filteredProducts={this.state.filteredProducts}
                productsSelectedForDownload={
                  this.state.productsSelectedForDownload
                }
                onFilterChange={this.onFilterChange}
                onChangeSelectAllForDownload={this.onChangeSelectAllForDownload}
                onChangeSelectedForDownload={this.onChangeSelectedForDownload}
                onDownload={this.handleDownload}
                onEdit={(product) => {
                  this.setState({
                    isEditPopupOpen: true,
                    selectedEditProduct: product,
                  });
                }}
                onDelete={(product) => this.handleDeletePhoto(product)}
              />
            )}
            {this.state.page == "addPhotos" && (
              <AddPhotos
                handleAddNewPhotos={this.handleAddNewPhotos}
                newPhotos={this.state.newPhotos}
                onChangePhoto={(index, value) =>
                  this.onChangeNewPhotoItem(index, "photo", value)
                }
                onChangeColor={(index, value) =>
                  this.onChangeNewPhotoItem(index, "color", value)
                }
                onChangeColorCode={(index, value) =>
                  this.onChangeNewPhotoItem(index, "colorCode", value)
                }
                onChangeManufacturerCode={(value) =>
                  this.setState({
                    newPhotos: {
                      ...this.state.newPhotos,
                      newManufacturerCode: value,
                    },
                  })
                }
                onChangeResalePrice={(value) =>
                  this.setState({
                    newPhotos: {
                      ...this.state.newPhotos,
                      newResalePrice: value,
                    },
                  })
                }
                onChangePackaging={(value) =>
                  this.setState({
                    newPhotos: { ...this.state.newPhotos, newPackaging: value },
                  })
                }
                onChangeDescription={(value) =>
                  this.setState({
                    newPhotos: {
                      ...this.state.newPhotos,
                      newDescription: value,
                    },
                  })
                }
              />
            )}
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
