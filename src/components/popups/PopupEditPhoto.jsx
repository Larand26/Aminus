import { Component } from "react";

import PopUp from "./PopUp";

import InputText from "../inputs/InputText";
import Select from "../inputs/Select";
import InputPhoto from "../inputs/InputPhoto";
import TextArea from "../inputs/TextArea";

import "../../styles/components/popups/popup-edit-photo.css";

const packagingOptions = [
  { value: "f", label: "Favo" },
  { value: "c", label: "Cartucho" },
];

class PopupEditPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      colorName: "",
      colorCode: "",
      resalePrice: "",
      manufacturer: "",
      photos: null,
      packaging: "",
      videoUrl: "",
    };
  }

  componentDidUpdate(prevProps) {
    // Atualiza o estado apenas quando o produto muda
    if (this.props.product !== prevProps.product && this.props.product) {
      const { product } = this.props;
      this.setState({
        description: product.descricao_produto || "",
        colorName: product.nome_cor || "",
        colorCode: product.codigo_cor || "",
        manufacturer: product.referencia || "",
        photos: product.fotos || [],
        packaging: product.embalamento || "",
        videoUrl: product.video_url || "",
        resalePrice: product.preco_revenda || "",
      });
    }
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose({
        description: this.state.description,
        colorName: this.state.colorName,
        colorCode: this.state.colorCode,
        resalePrice: this.state.resalePrice,
        manufacturer: this.state.manufacturer,
        photos: this.state.photos,
        packaging: this.state.packaging,
        videoUrl: this.state.videoUrl,
      });
    }
  };

  render() {
    const { isOpen } = this.props;
    return (
      <PopUp
        isOpen={isOpen}
        onClose={this.handleClose}
        width="1200px"
        height="600px"
      >
        <div className="popup-edit-photo">
          <div className="photos-container">
            <InputPhoto
              photos={this.state.photos ? this.state.photos : []}
              onChange={(photos) => this.setState({ photos: photos })}
            />
          </div>
          <div className="infos">
            <div className="description-container">
              <TextArea
                value={this.state.description}
                onChange={(description) => this.setState({ description })}
                placeholder="Descrição"
              />
            </div>
            <div className="infos-data">
              <div className="inputs-container">
                <InputText
                  label="Código do fabricante"
                  value={this.state.manufacturer}
                  onChange={(manufacturer) => this.setState({ manufacturer })}
                />
                <InputText
                  label="Preço de revenda"
                  value={this.state.resalePrice}
                  onChange={(resalePrice) => this.setState({ resalePrice })}
                />

                <InputText
                  label="Cor"
                  value={this.state.colorName}
                  onChange={(colorName) => this.setState({ colorName })}
                />
                <Select
                  label="Embalagem"
                  options={packagingOptions}
                  value={this.state.packaging}
                  onChange={(packaging) => this.setState({ packaging })}
                />
                <InputText
                  label="Código da cor"
                  value={this.state.colorCode}
                  onChange={(colorCode) => this.setState({ colorCode })}
                />
                <InputText
                  label="Url do vídeo"
                  value={this.state.videoUrl}
                  onChange={(videoUrl) => this.setState({ videoUrl })}
                />
              </div>
              <div className="video-container">
                <video src={this.state.videoUrl} controls></video>
              </div>
            </div>
          </div>
        </div>
      </PopUp>
    );
  }
}

export default PopupEditPhoto;
