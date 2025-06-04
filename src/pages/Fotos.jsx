import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";
import React, { useState, useCallback, useEffect } from "react";
import JSZip from "jszip";

const Fotos = () => {
  const [fotos, setFotos] = useState([]);
  const search = () => {
    const foto = {
      referencia: document.getElementById("inputReferencia").value,
      codigo_cor: document.getElementById("inputCodigoCor").value,
    };

    window.electronApi?.searchFoto(foto);
    window.electronApi?.onSearchFotoResponse((fotos) => {
      setFotos(fotos);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputReferencia").value = "";
      document.getElementById("inputCodigoCor").value = "";
    });
  };

  // Substitua a função handleDownload por esta:
  const handleDownload = async (fotosObj, nome) => {
    const zip = new JSZip();
    Object.entries(fotosObj).forEach(([key, base64]) => {
      if (base64) {
        zip.file(`${nome}_${key}.jpg`, base64, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${nome || "fotos"}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      search();
    }
  }, []);

  useEffect(() => {
    const inputs = [
      document.getElementById("inputReferencia"),
      document.getElementById("inputCodigoCor"),
    ];
    inputs.forEach((input) => {
      if (input) input.addEventListener("keydown", handleKeyDown);
    });
    return () => {
      inputs.forEach((input) => {
        if (input) input.removeEventListener("keydown", handleKeyDown);
      });
    };
  }, [handleKeyDown]);

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputReferencia" />
          <label htmlFor="inputReferencia">Referência</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCodigoCor" />
          <label htmlFor="inputCodigoCor">Código da Cor</label>
        </FloatLabel>
      </BarraLateral>
      <div
        className="content flex flex-wrap align-items-center justify-content-center gap-4 w-full bg-gray-200 p-4"
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
          minHeight: "300px",
        }}
      >
        {fotos.map((foto, index) => (
          <Card
            key={index}
            title={foto.referencia}
            subTitle={foto.codigo_cor}
            className="md:w-13rem"
            footer={
              <button
                className="p-button p-component w-full flex justify-content-center"
                onClick={() => handleDownload(foto.fotos, foto.referencia)}
              >
                <span>Download </span>
                <i className="pi pi-download"></i>
              </button>
            }
          >
            <img
              src={`data:image/jpeg;base64,${foto.fotos.foto_principal}`}
              alt=""
              className="w-full h-auto"
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Fotos;
