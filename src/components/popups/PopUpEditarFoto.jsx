import { useState } from "react";
import InputFile from "../InputFile";
import InputLabel from "../InputLabel";
import SelectLabel from "../SelectLabel";

import "../../styles/popup-editar-foto.css";

const PopUpEditarFoto = (props) => {
  // transforma em array
  const fotos = Object.values(props.foto?.fotos || {});

  return (
    <div className="pop-up-editar">
      <h2>Editar Foto</h2>
      <div>
        <InputFile onChange={() => {}} initialFiles={fotos} />
      </div>
      <div className="info-geral-edit">
        <div className="descricao-content">
          <textarea
            value={props.foto?.descricao_produto}
            name="descricao"
            id="descricao"
          ></textarea>
        </div>
        <div className="infos-content">
          <InputLabel
            className="texto-preto"
            label="Cod Fabricante"
            value={props.foto?.referencia}
          />
          <InputLabel
            className="texto-preto"
            label="Cod Cor"
            value={props.foto?.codigo_cor}
          />
          <InputLabel
            className="texto-preto"
            label="Preco Revenda"
            value={props.foto?.preco_revenda}
          />
          <InputLabel
            className="texto-preto"
            label="Cod Cor"
            value={props.foto?.nome_cor}
          />
          <SelectLabel
            className="texto-preto"
            label="Embalamento"
            value={props.foto?.embalamento}
            options={[
              { value: "f", label: "Favo" },
              { value: "c", label: "Cartucho" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default PopUpEditarFoto;
