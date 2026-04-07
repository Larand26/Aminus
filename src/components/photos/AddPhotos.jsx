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
    const {
      newPhotos,
      onChangePhoto,
      onChangeColor,
      onChangeColorCode,
      onChangeManufacturerCode,
      onChangeResalePrice,
      onChangePackaging,
      onChangeDescription,
      handleAddNewPhotos,
    } = this.props;
    // newPhotos = { newManufacturerCode: "", newPackaging: "", newDescription: "", newPhotos: [{ photo: [Base64], color: "", colorCode: "" }] }
    const photoItems =
      newPhotos?.newPhotos?.length > 0
        ? newPhotos.newPhotos
        : [{ photo: [], color: "", colorCode: "" }];

    return (
      <>
        <div className="add-photos">
          {/* Aqui vai ficar a parte das fotos e cores */}
          <div className="add-photos-media-section">
            {photoItems.map((photoItem, index) => (
              <div className="add-photos-media-item" key={index}>
                <InputPhoto
                  label={`Foto ${index + 1}`}
                  photos={photoItem?.photo || []}
                  onChange={(value) => onChangePhoto(index, value)}
                />
                <div className="add-photos-color-fields">
                  <InputText
                    label="Cor"
                    value={photoItem?.color || ""}
                    onChange={(value) => onChangeColor(index, value)}
                  />
                  <InputText
                    label="Código de cor"
                    value={photoItem?.colorCode || ""}
                    onChange={(value) => onChangeColorCode(index, value)}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Aqui vai ficar a parte de referencia, descrição e embalagem */}
          <div className="add-photos-details-section">
            <InputText
              label="Referência"
              value={newPhotos?.newManufacturerCode || ""}
              onChange={onChangeManufacturerCode}
            />
            <InputText
              label="Preço de revenda"
              value={newPhotos?.newResalePrice || ""}
              onChange={onChangeResalePrice}
            />
            <Select
              label="Embalagem"
              options={packagingOptions}
              value={newPhotos?.newPackaging || ""}
              onChange={onChangePackaging}
            />
            <TextArea
              label="Descrição"
              value={newPhotos?.newDescription || ""}
              onChange={onChangeDescription}
            />
            <Button
              text="Adicionar Fotos"
              className="add-photos-submit-button"
              onClick={handleAddNewPhotos}
            />
          </div>
        </div>
      </>
    );
  }
}

export default AddPhotos;
