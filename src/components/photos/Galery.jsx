import { Component } from "react";

import Card from "../misc/Card";
import ActionButtons from "../buttons/ActionButtons";
import Button from "../buttons/Button";
import InputText from "../inputs/InputText";
import InputCheckBox from "../inputs/InputCheckBox";

import PhotoUtil from "../../utils/Photo";

import unknown from "../../assets/img/unknown.jpg";

class Galery extends Component {
  render() {
    const {
      filterText,
      filteredProducts,
      productsSelectedForDownload,
      onFilterChange,
      onChangeSelectAllForDownload,
      onChangeSelectedForDownload,
      onDownload,
      onEdit,
      onDelete,
    } = this.props;

    return (
      <>
        <div className="filter-actions">
          <InputText
            className="filter-input"
            value={filterText}
            onChange={(value) => onFilterChange(value)}
          />
          <InputCheckBox
            checked={filteredProducts.every((product) =>
              productsSelectedForDownload.includes(product),
            )}
            onChange={onChangeSelectAllForDownload}
          />
          <Button
            className="download-btn"
            text="Baixar"
            icon="fa fa-download"
            onClick={() => onDownload(null)}
          />
        </div>

        <div className="fotos-container">
          {filteredProducts.map((product) => {
            const photoUrls = PhotoUtil.getPhotoUrls(product);
            return (
              <Card
                key={product.id_product}
                photos={photoUrls.length > 0 ? photoUrls : [unknown]}
                fallbackPhoto={unknown}
                onClick={() => onChangeSelectedForDownload(product)}
                className={
                  productsSelectedForDownload.includes(product)
                    ? "hover-card card-selected"
                    : "hover-card"
                }
              >
                <p className="ref">{product.manufacturer_code}</p>
                <p className="color-name">{product.color_name}</p>
                <p className="color-code">{product.color_code}</p>
                <ActionButtons
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product)}
                  onDownload={() => onDownload(product)}
                />
              </Card>
            );
          })}
        </div>
      </>
    );
  }
}

export default Galery;
