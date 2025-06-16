import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";
import React, { useState, useCallback, useEffect } from "react";
import JSZip from "jszip";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method

import "../styles/cadastro-fotos.css";

const Fotos = () => {
  // UseStates
  const [fotos, setFotos] = useState([]);
  const [embalagem, setEmbalagem] = useState(null);

  const search = (ref) => {
    const foto = {
      referencia: ref ? ref : document.getElementById("inputReferencia").value,
      codigo_cor: document.getElementById("inputCodigoCor").value,
    };

    window.electronApi?.searchFoto(foto);
    window.electronApi?.onSearchFotoResponse((fotos) => {
      setFotos(Array.isArray(fotos) ? fotos : fotos ? [fotos] : []);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputReferencia").value = "";
      document.getElementById("inputCodigoCor").value = "";
    });
  };

  const embalagemOptions = [
    { label: "Favo", value: "f" },
    { label: "Cartucho", value: "c" },
  ];

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

  const cadastraFotos = async (files) => {
    //Coverte files para base64
    const convertToBase64 = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });
    };
    if (!files) return;
    const fotos = {
      foto_principal: files[0] ? await convertToBase64(files[0]) : null,
      foto_produto_1: files[1] ? await convertToBase64(files[1]) : null,
      foto_produto_2: files[2] ? await convertToBase64(files[2]) : null,
      foto_produto_3: files[3] ? await convertToBase64(files[3]) : null,
      foto_produto_4: files[4] ? await convertToBase64(files[4]) : null,
      foto_produto_5: files[5] ? await convertToBase64(files[5]) : null,
      foto_complementar: null,
    };
    const produto = {
      referencia: document.getElementById("inputCadastroReferencia").value,
      codigo_cor: document.getElementById("inputCadastroCodigoCor").value,
      preco: document.getElementById("inputCadastroPreco").value,
      embalagem: embalagem,
      fotos: fotos,
      descricao_produto: document.getElementById("inputCadastroDescricao")
        ? document.getElementById("inputCadastroDescricao").value
        : "",
      nome_cor: document.getElementById("inputNomeCor")
        ? document.getElementById("inputNomeCor").value
        : "",
    };

    window.electronApi?.cadastraFotos(produto);
    window.electronApi?.onCadastraFotosResponse((response) => {
      if (response.success) {
        console.log("Fotos cadastradas com sucesso!");
      } else {
        console.error("Erro ao cadastrar fotos:", response.error);
      }
    });
  };

  const deleteFotos = async (foto) => {
    console.log("Excluindo foto:", foto);

    window.electronApi?.deleteFoto(foto);
    window.electronApi?.onDeleteFotoResponse((response) => {
      if (response.success) {
        search(foto.referencia);
        console.log("Foto excluída com sucesso!");
      } else {
        console.error("Erro ao excluir foto:", response.error);
      }
    });
  };

  const confirmDelete = (event, foto) => {
    confirmPopup({
      target: event.currentTarget, // Agora o target é o botão clicado
      message: `Você tem certeza que deseja excluir a foto ${foto.referencia}?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      acceptClassName: "p-button-danger",
      accept: () => deleteFotos(foto),
      reject: () => {
        console.log("Exclusão cancelada");
      },
    });
  };

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
      <TabView className="w-full h-screen">
        <TabPanel header="Fotos">
          <div
            className="content flex flex-wrap align-items-center justify-content-center gap-4 w-full bg-gray-200 p-4 h-screen"
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
                  <div className="flex gap-2">
                    <ConfirmPopup />
                    <button
                      className="p-button p-component w-full flex justify-content-center gap-2"
                      onClick={() =>
                        handleDownload(foto.fotos, foto.referencia)
                      }
                    >
                      <i className="pi pi-download"></i>
                    </button>
                    <button
                      className="p-button p-button-danger p-component w-full flex justify-content-center gap-2"
                      type="button"
                      onClick={(e) => confirmDelete(e, foto)}
                    >
                      <i className="pi pi-trash"></i>
                    </button>
                  </div>
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
        </TabPanel>
        <TabPanel header="Cadastro">
          <div
            className="content flex flex-wrap justify-content-center w-full bg-gray-200 p-4 h-screen"
            style={{
              overflowY: "auto",
              minHeight: "300px",
            }}
          >
            <div className="flex justify-content-center w-6">
              <FileUpload
                name="fotos"
                accept="image/*"
                multiple
                maxFileSize={1000000}
                className="w-10"
                chooseLabel="Selecionar"
                uploadLabel="Cadastrar"
                cancelIcon="pi pi-trash"
                cancelLabel="Limpar"
                customUpload={true}
                uploadHandler={(e) => cadastraFotos(e.files)}
              />
            </div>
            <div className=" w-6">
              <div className="inputs-cadastro-fotos flex flex-wrap gap-4 mb-4">
                <FloatLabel>
                  <InputText id="inputCadastroReferencia" />
                  <label htmlFor="inputCadastroReferencia">Referência</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="inputCadastroCodigoCor" />
                  <label htmlFor="inputCadastroCodigoCor">Código da Cor</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="inputNomeCor" />
                  <label htmlFor="inputNomeCor">Nome da Cor</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="inputCadastroPreco" />
                  <label htmlFor="inputCadastroPreco">Preço</label>
                </FloatLabel>
                <FloatLabel>
                  <Dropdown
                    id="inputCadastroEmbalagem"
                    options={embalagemOptions}
                    placeholder="Selecione a embalagem"
                    value={embalagem}
                    onChange={(e) => setEmbalagem(e.value)}
                  />
                  <label htmlFor="inputCadastroEmbalagem">Embalagem</label>
                </FloatLabel>
              </div>
              <InputTextarea
                value={null}
                onChange={(e) => {}}
                rows={5}
                cols={30}
                className="w-full h-10"
                id="inputCadastroDescricao"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Fotos;
