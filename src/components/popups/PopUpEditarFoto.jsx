import { useState, useEffect, useRef } from "react";
import InputFile from "../InputFile";
import InputLabel from "../InputLabel";
import SelectLabel from "../SelectLabel";

import "../../styles/popup-editar-foto.css";

const PopUpEditarFoto = (props) => {
  const [formData, setFormData] = useState({});
  // 1. Cria uma ref para armazenar a versão mais recente do formData
  const latestFormData = useRef(formData);

  useEffect(() => {
    const initialData = props.foto || {};
    setFormData(initialData);
    latestFormData.current = initialData; // Sincroniza a ref também
  }, [props.foto]);

  // 2. Este useEffect agora só serve para manter a ref atualizada
  useEffect(() => {
    latestFormData.current = formData;
  }, [formData]);

  // 3. Este useEffect roda apenas na montagem e desmontagem
  useEffect(() => {
    return () => {
      if (props.onCloseAndSave) {
        // Usa o valor atual da ref, que sempre terá os dados mais recentes
        props.onCloseAndSave(latestFormData.current);
      }
    };
  }, [props.onCloseAndSave]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
            value={formData.descricao_produto || ""}
            name="descricao_produto"
            id="descricao"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          ></textarea>
        </div>
        <div className="infos-content">
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
