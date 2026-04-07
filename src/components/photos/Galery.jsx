import { Component } from "react";

import Card from "../misc/Card";
import ActionButtons from "../buttons/ActionButtons";
import Button from "../buttons/Button";
import InputText from "../inputs/InputText";
import InputCheckBox from "../inputs/InputCheckBox";

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
          {filteredProducts.map((product) => (
            <Card
              key={`${product.referencia}-${product.codigo_cor}`}
              photo={product.fotos[0] || unknown}
              onClick={() => onChangeSelectedForDownload(product)}
              className={
                productsSelectedForDownload.includes(product)
                  ? "hover-card card-selected"
                  : "hover-card"
              }
            >
              <p className="ref">{product.referencia}</p>
              <p className="color-name">{product.nome_cor}</p>
              <p className="color-code">{product.codigo_cor}</p>
              <ActionButtons
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product)}
                onDownload={() => onDownload(product)}
              />
            </Card>
          ))}
        </div>
      </>
    );
  }
}

export default Galery;
