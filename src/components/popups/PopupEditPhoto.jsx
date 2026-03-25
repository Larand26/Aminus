import { Component } from "react";

import PopUp from "./PopUp";

import InputText from "../inputs/InputText";
import Select from "../inputs/Select";
import InputPhoto from "../inputs/InputPhoto";

import Utils from "../../utils/Utils";

import "../../styles/components/popups/popup-edit-photo.css";

class PopupEditPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      color: "",
      manufacturer: "",
      photos: null,
    };
  }

  componentDidUpdate(prevProps) {
    // Atualiza o estado apenas quando o produto muda
    if (this.props.product !== prevProps.product && this.props.product) {
      const { product } = this.props;
      this.setState({
        name: product.nome_produto || "",
        description: product.descricao || "",
        color: product.codigo_cor || "",
        manufacturer: product.codigo_fabricante || "",
        photos:
          product.fotos && product.fotos.length > 0
            ? product.fotos.map((foto) => Utils.bufferToBase64(foto.buffer))
            : [],
      });
    }
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <PopUp isOpen={isOpen} onClose={onClose}>
        <div className="popup-edit-photo">
          <InputPhoto
            photos={this.state.photos ? this.state.photos : []}
            onChange={(photos) => this.setState({ photos: photos })}
          />
        </div>
      </PopUp>
    );
  }
}

export default PopupEditPhoto;
