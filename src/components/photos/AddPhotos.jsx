import { Component } from "react";

// Components
// misc

// inputs
import InputText from "../inputs/InputText";
import InputPhoto from "../inputs/InputPhoto";
import Select from "../inputs/Select";
import TextArea from "../inputs/TextArea";

// buttons
import Button from "../buttons/Button";

// options
const packagingOptions = [
  { value: "f", label: "Favo" },
  { value: "c", label: "Cartucho" },
];

// styles
import "../../styles/pages/addPhotos.css";

class AddPhotos extends Component {
  render() {
    return (
      <>
        <div className="add-photos">
          {/* Aqui vai ficar a parte das fotos e cores */}
          <div className="add-photos-media-section">
            <div className="add-photos-media-item">
              <InputPhoto label="Foto 1" />
              <div className="add-photos-color-fields">
                <InputText label="Cor" />
                <InputText label="Código de cor" />
              </div>
            </div>
          </div>
          {/* Aqui vai ficar a parte de referencia, descrição e embalagem */}
          <div className="add-photos-details-section">
            <InputText label="Referência" />
            <Select label="Embalagem" options={packagingOptions} />
            <TextArea label="Descrição" />
            <Button
              text="Adicionar Fotos"
              className="add-photos-submit-button"
            />
          </div>
        </div>
      </>
    );
  }
}

export default AddPhotos;
