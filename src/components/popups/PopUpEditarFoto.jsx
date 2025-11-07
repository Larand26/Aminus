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

  const fileToBase64 = async (file) => {
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return base64;
    } catch (error) {
      console.error("Erro ao converter arquivo para base64:", error);
      return null;
    }
  };

  const handleChange = async (name, value) => {
    if (name === "fotos") {
      // 'value' é o array de arquivos/strings do InputFile
      const base64Promises = value.map(async (fileOrString) => {
        if (fileOrString instanceof File) {
          const base64 = await fileToBase64(fileOrString);
          // Retorna apenas a parte base64 da string
          return base64 ? base64.split(",")[1] : null;
        }
        // Se já for uma string (base64), retorna como está
        return fileOrString;
      });

      // Filtra valores nulos que podem vir de erros de conversão
      const fotosArray = (await Promise.all(base64Promises)).filter(Boolean);

      setFormData((prevData) => ({
        ...prevData,
        fotos: fotosArray,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Como props.foto.fotos agora é um array, podemos usá-lo diretamente.
  const fotos = props.foto?.fotos || [];

  return (
    <div className="pop-up-editar">
      <h2>Editar Foto</h2>
      <div>
        <InputFile
          onChange={(files) => handleChange("fotos", files)}
          initialFiles={fotos}
        />
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
