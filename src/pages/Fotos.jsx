import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";
import React, { useState, useCallback, useEffect, useRef } from "react";
import JSZip from "jszip";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
import cadastraFotos from "../utils/cadastraFotos";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

import "../styles/cadastro-fotos.css";

const Fotos = () => {
  // UseStates
  const [fotos, setFotos] = useState([]); // Fotos
  // Estados para os inputs de pesquisa
  const [referenciaSearch, setReferenciaSearch] = useState("");
  const [codigoCorSearch, setCodigoCorSearch] = useState("");
  // Estados para os inputs de cadastro
  const [referenciaCadastro, setReferenciaCadastro] = useState("");
  const [codigoCorCadastro, setCodigoCorCadastro] = useState("");
  const [nomeCorCadastro, setNomeCorCadastro] = useState("");
  const [precoCadastro, setPrecoCadastro] = useState("");
  const [embalagemCadastro, setEmbalagemCadastro] = useState(null);
  const [descricaoCadastro, setDescricaoCadastro] = useState("");
  const [loading, setLoading] = useState(false); // novo estado
  const [loadingCadastro, setLoadingCadastro] = useState(false); // estado para loading do cadastro
  const toast = useRef(null); // Adicione esta linha

  // search agora recebe sempre os valores como argumento
  const search = (ref, cor) => {
    if ((ref && ref.length < 5) || (cor && cor.length < 5)) return;
    setLoading(true); // inicia carregamento
    const foto = {
      referencia: ref,
      codigo_cor: cor,
    };
    console.log("Buscando foto:", foto);

    window.electronApi?.searchFoto(foto);
    window.electronApi?.onSearchFotoResponse((fotos) => {
      setFotos(Array.isArray(fotos) ? fotos : fotos ? [fotos] : []);
      setLoading(false); // finaliza carregamento
    });
  };

  const embalagemOptions = [
    { label: "Favo", value: "f" },
    { label: "Cartucho", value: "c" },
  ];

  // Substitua a função handleDownload por esta:
  const handleDownload = async (fotosObj, nome, codigoCor) => {
    console.log("Iniciando download para:", nome, fotosObj);

    const zip = new JSZip();
    Object.entries(fotosObj).forEach(([key, base64]) => {
      if (base64) {
        zip.file(`${nome}_${key}_${codigoCor}.jpg`, base64, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${nome || "cor"}_${codigoCor || "cor"}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      const ref = document.getElementById("inputReferencia").value;
      const cor = document.getElementById("inputCodigoCor").value;
      search(ref, cor);
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

  const handleCadastroFotos = async (files) => {
    if (!files || files.length === 0) {
      return "Nenhum arquivo selecionado.";
    }
    setLoadingCadastro(true);

    const produto = {
      referencia: referenciaCadastro,
      codigo_cor: codigoCorCadastro,
      nome_cor: nomeCorCadastro,
      preco: precoCadastro,
      embalagem: embalagemCadastro,
      descricao_produto: descricaoCadastro,
    };

    try {
      // Aguarda o resultado do cadastro usando Promise
      const result = await new Promise((resolve) => {
        cadastraFotos(files, produto).then((res) => {
          // Se cadastraFotos já retorna erro de validação, resolve imediatamente
          if (
            res &&
            typeof res === "object" &&
            ("success" in res || "error" in res)
          ) {
            resolve(res);
          } else {
            window.electronApi?.onCadastraFotosResponse((response) => {
              resolve(response);
            });
          }
        });
      });

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Fotos cadastradas com sucesso!`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: `Erro: ${result.message}`,
          life: 3000,
        });
      }
      return result;
    } finally {
      setLoadingCadastro(false);
    }
  };

  return (
    <div className="flex">
      <Toast ref={toast} />
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="inputReferencia"
            value={referenciaSearch}
            onChange={(e) => {
              setReferenciaSearch(e.target.value);
              search(e.target.value, codigoCorSearch); // sempre usa o valor mais recente
            }}
          />
          <label htmlFor="inputReferencia">Referência</label>
        </FloatLabel>
        <FloatLabel>
          <InputText
            id="inputCodigoCor"
            value={codigoCorSearch}
            onChange={(e) => {
              setCodigoCorSearch(e.target.value);
              search(referenciaSearch, e.target.value); // sempre usa o valor mais recente
            }}
          />
          <label htmlFor="inputCodigoCor">Código da Cor</label>
        </FloatLabel>
      </BarraLateral>
      <TabView className="w-full h-screen">
        <TabPanel header="Fotos">
          <div
            className="content flex flex-wrap align-items-center justify-content-center gap-4 w-full bg-gray-200 p-4"
            style={{
              maxHeight: "100vh",
              overflowY: "auto",
              minHeight: "300px",
              paddingBottom: "0px", // pode remover ou deixar pequeno
            }}
          >
            {loading ? (
              <div
                className="flex justify-content-center align-items-center w-full"
                style={{ minHeight: 200 }}
              >
                <ProgressSpinner />
              </div>
            ) : (
              <>
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
                            handleDownload(
                              foto.fotos,
                              foto.referencia,
                              foto.codigo_cor
                            )
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
                    <p className="text-xs text-center text-overflow-ellipsis">
                      {foto.nome_cor}
                    </p>
                  </Card>
                ))}
                {/* Spacer para garantir espaço no final e evitar corte dos botões */}
                <div style={{ width: "100%", height: 50 }} />
              </>
            )}
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
                uploadHandler={(e) => handleCadastroFotos(e.files)}
              />
            </div>
            <div className=" w-6">
              <div className="inputs-cadastro-fotos flex flex-wrap gap-4 mb-4">
                <FloatLabel>
                  <InputText
                    id="inputCadastroReferencia"
                    onChange={(e) => setReferenciaCadastro(e.target.value)}
                  />
                  <label htmlFor="inputCadastroReferencia">Referência</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText
                    id="inputCadastroCodigoCor"
                    onChange={(e) => setCodigoCorCadastro(e.target.value)}
                  />
                  <label htmlFor="inputCadastroCodigoCor">Código da Cor</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText
                    id="inputNomeCor"
                    onChange={(e) => setNomeCorCadastro(e.target.value)}
                  />
                  <label htmlFor="inputNomeCor">Nome da Cor</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText
                    id="inputCadastroPreco"
                    onChange={(e) => setPrecoCadastro(e.target.value)}
                  />
                  <label htmlFor="inputCadastroPreco">Preço</label>
                </FloatLabel>
                <FloatLabel>
                  <Dropdown
                    id="inputCadastroEmbalagem"
                    options={embalagemOptions}
                    placeholder="Selecione a embalagem"
                    value={embalagemCadastro}
                    onChange={(e) => setEmbalagemCadastro(e.value)}
                  />
                  <label htmlFor="inputCadastroEmbalagem">Embalagem</label>
                </FloatLabel>
              </div>
              <InputTextarea
                value={null}
                onChange={(e) => {
                  setDescricaoCadastro(e.target.value);
                }}
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
