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
      editDraft: null,

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

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: response.error
            ? `Erro ao atualizar a foto: ${response.error}`
            : "Erro ao atualizar a foto. Tente novamente.",
          type: "falha",
        },
        // Reabre a edição com o que foi digitado, para corrigir sem perder fotos e campos.
        isEditPopupOpen: true,
        selectedEditProduct: oldProduct,
        editDraft: newProduct,
      });
      return;
    }

    if (response.unchanged) return;

    this.setState({
      toastInfo: {
        key: Date.now(),
        message: "Foto atualizada com sucesso.",
        type: "sucesso",
      },
    });
    this.getPhotos(newProduct.manufacturer);
  };

  onFilterChange = (value) => {
    this.setState({ filterText: value });

    const search = value.toLowerCase();
    const filtered = this.state.productsData.filter((product) =>
      [product.manufacturer_code, product.color_name, product.color_code].some(
        (field) => (field || "").toLowerCase().includes(search),
      ),
    );

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
    const products = product
      ? [product]
      : this.state.productsSelectedForDownload;
    if (products.length === 0) return;

    const response = await PhotoUtil.downloadPhoto({
      token: this.state.token,
      products,
    });

    if (!response.success && response.error) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: `Erro ao baixar as fotos: ${response.error}`,
          type: "falha",
        },
      });
    }
  };

  createEmptyPhotoItem = () => ({ photo: [], color: "", colorCode: "" });

  isPhotoItemComplete = (photoItem) => {
    return Array.isArray(photoItem?.photo) && photoItem.photo.length > 0;
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
    const { newPhotos: formData } = this.state;
    const photosToAdd = formData.newPhotos.filter((photoItem) =>
      this.isPhotoItemComplete(photoItem),
    );
    const newPhotos = { ...formData, newPhotos: photosToAdd };
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
      const firstError =
        response.error || response.data?.find((item) => !item.success)?.error;
      // O backend responde um item por cor, na mesma ordem; só as cores que falharam ficam no formulário.
      const failedItems = Array.isArray(response.data)
        ? photosToAdd.filter((_, index) => !response.data[index]?.success)
        : photosToAdd;
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: firstError
            ? `Erro ao criar as fotos: ${firstError}`
            : "Erro ao criar as fotos. Tente novamente.",
          type: "falha",
        },
        newPhotos: {
          ...formData,
          newPhotos: [...failedItems, this.createEmptyPhotoItem()],
        },
      });
      if (response.data?.some((item) => item.success)) {
        this.getPhotos(newPhotos.newManufacturerCode);
      }
    }
  };

  handleDeletePhoto = async (product) => {
    const response = await PhotoUtil.deletePhoto({
      token: this.state.token,
      productId: product.id_product,
    });

    if (!response.success) {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao deletar a foto. Tente novamente.",
          type: "falha",
        },
      });
      this.getPhotos(product.manufacturer_code);
      return;
    }

    const removeDeleted = (products) =>
      products.filter((p) => p.id_product !== product.id_product);
    this.setState((prevState) => ({
      productsData: removeDeleted(prevState.productsData),
      filteredProducts: removeDeleted(prevState.filteredProducts),
      productsSelectedForDownload: removeDeleted(
        prevState.productsSelectedForDownload,
      ),
      toastInfo: {
        key: Date.now(),
        message: "Produto removido com sucesso.",
        type: "sucesso",
      },
    }));
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
          <SideBar onSearch={() => this.getPhotos()}>
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
                onChangeIsEva={(
                  e, // Alterado de (value) para (e)
                ) =>
                  this.setState({
                    newPhotos: {
                      ...this.state.newPhotos,
                      newIsEva: e.target.checked, // Extrai o booleano correto do checkbox
                    },
                  })
                }
              />
            )}
          </Content>
          <EditPhotoPopup
            isOpen={this.state.isEditPopupOpen}
            onClose={(data) => {
              if (this.state.selectedEditProduct) {
                this.updatePhoto(data, this.state.selectedEditProduct);
              }
              this.setState({
                isEditPopupOpen: false,
                selectedEditProduct: null,
                editDraft: null,
              });
            }}
            product={this.state.selectedEditProduct}
            draft={this.state.editDraft}
          />
        </div>
      </>
    );
  }
}

export default Photos;
