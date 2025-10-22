import { useState, useEffect } from "react";
import InputFile from "../InputFile";
import InputLabel from "../InputLabel";
import SelectLabel from "../SelectLabel";

import "../../styles/popup-editar-foto.css";

const PopUpEditarFoto = (props) => {
  // 1. Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState({});

  // 2. Sincroniza o estado com as props quando elas mudam
  useEffect(() => {
    setFormData(props.foto || {});
  }, [props.foto]);

  // 3. Função para atualizar o estado
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
          {/* 4. Conecta a textarea ao estado */}
          <textarea
            value={formData.descricao_produto || ""}
            name="descricao_produto"
            id="descricao"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          ></textarea>
        </div>
        <div className="infos-content">
          {/* 5. Conecta os InputLabel e SelectLabel ao estado */}
          <InputLabel
            className="texto-preto"
            label="Cod Fabricante"
            value={formData.referencia || ""}
            onChange={(value) => handleChange("referencia", value)}
          />
          <SelectLabel
            className="texto-preto"
            label="Embalamento"
            value={formData.embalamento || ""}
            onChange={(value) => handleChange("embalamento", value)}
            options={[
              { value: "f", label: "Favo" },
              { value: "c", label: "Cartucho" },
            ]}
          />
          <InputLabel
            className="texto-preto"
            label="Preco Revenda"
            value={formData.preco_revenda || ""}
            onChange={(value) => handleChange("preco_revenda", value)}
          />
          <InputLabel
            className="texto-preto"
            label="Cod Cor"
            value={formData.codigo_cor || ""}
            onChange={(value) => handleChange("codigo_cor", value)}
          />
          <InputLabel
            className="texto-preto"
            label="Nome Cor"
            value={formData.nome_cor || ""}
            onChange={(value) => handleChange("nome_cor", value)}
          />
        </div>
      </div>
    </div>
  );
};
export default PopUpEditarFoto;
