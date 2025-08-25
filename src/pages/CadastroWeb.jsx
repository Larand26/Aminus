import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";

import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import "../styles/icons.css";

const CadastroWeb = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [cores, setCores] = useState([]);
  const [novaCor, setNovaCor] = useState("");
  const [grade, setGrade] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [nomeFormatado, setNomeFormatado] = useState("");

  const makeNomeFormatado = () => {
    let genero = grupo[2] || "";
    let tipo = grupo[3] || "";

    if (
      (tipo === "SANDÁLIA" || tipo === "RASTEIRA") &&
      (genero === "MASCULINO" || genero === "FEMININO")
    ) {
      genero = genero === "MASCULINO" ? "MASCULINA" : "FEMININA";
    }

    switch (tipo) {
      case "SANDÁLIA":
        tipo = "SANDALIA";
        break;
      case "CHINELO DEDO":
        tipo = "CHINELO";
        break;
      case "CHINELO GÁSPEA/SLIDE":
        tipo = "CHINELO SLIDE";
        break;
      case "BABUCH":
        tipo = "BABUCHE";
        break;
      default:
        tipo = "";
    }

    return `${tipo} ${genero} ${nome} - ${produtos[0]?.PROD_CODFABRIC || ""}`;
  };

  const changeGrupo = (newGrupo, index) => {
    // troca o grupo atual pelo novo
    setGrupo((prevGrupo) => {
      const updatedGrupo = [...prevGrupo];
      updatedGrupo[index] = newGrupo;
      return updatedGrupo;
    });
  };

  const makeGrade = (numeros, quantidades) => {
    if (!numeros || !quantidades) return;

    const nums = numeros.split(",");
    const quants = quantidades.split(",");

    if (nums.length !== quants.length) {
      console.error("Números e quantidades têm tamanhos diferentes");
      return;
    }

    const novaGrade = nums.map((num, index) => ({
      NUMERO: num.trim(),
      QUANTIDADE: quants[index] ? quants[index].trim() : "0",
    }));

    setGrade(novaGrade);
  };

  useEffect(() => {
    const handler = (produtos) => {
      setProdutos(produtos);
      console.log(produtos);
      setNome(produtos[0]?.PROD_DESCRCOMPLETA || "");
      makeGrade(produtos[0]?.NUMEROS, produtos[0]?.QUANTIDADES);
      setGrupo(produtos[0]?.GRUP_DESCRICAO.split(", ") || []);
      setCarregando(false);
    };

    window.electronApi?.onSearchCadastroProdutosResponse(handler);

    return () => {
      window.electronApi?.removeSearchCadastroProdutosResponse?.(handler);
    };
  }, []); // Executa apenas uma vez

  const buscarProdutos = () => {
    setCarregando(true);
    window.electronApi?.searchCadastroProdutos(referencia);
  };

  // Handler para selecionar todos ao clicar no primeiro radio
  const selecionarProdutos = (e) => {
    if (e.value.length === 1 && e.value[0] === produtos[0]) {
      setSelectedProdutos(produtos); // Seleciona todos
    } else {
      setSelectedProdutos(e.value);
    }
  };
  const checked = useCallback((e) => {
    console.log(e.target.checked);
  }, []);

  const alternarStatusProduto = useCallback((index) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((prod, i) =>
        i === index
          ? {
              ...prod,
              PRO_ATIVO_ECOMMERCE: !prod.PRO_ATIVO_ECOMMERCE,
              PRO_INTEGRACAO_ECOMMERCE: !prod.PRO_INTEGRACAO_ECOMMERCE,
            }
          : prod
      )
    );
  }, []);

  const renderizarCheckboxAtivo = (rowData, options) => {
    const index = produtos.findIndex(
      (prod) => prod.ID_CODPRODUTO === rowData.ID_CODPRODUTO
    );
    const isAtivo =
      rowData.PRO_ATIVO_ECOMMERCE === true &&
      rowData.PRO_INTEGRACAO_ECOMMERCE === true;

    return (
      <input
        type="checkbox"
        checked={isAtivo}
        onChange={() => alternarStatusProduto(index)}
        style={{ width: "20px", height: "20px", cursor: "pointer" }} // Tamanho aumentado
      />
    );
  };

  return (
    <div className="flex">
      <BarraLateral search={buscarProdutos}>
        <FloatLabel>
          <InputText
            id="inputNome"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <label htmlFor="inputNome">Referência</label>
        </FloatLabel>
      </BarraLateral>
      <div className="content flex flex-column align-items-center w-full min-h-screen bg-gray-200 p-4">
        <div
          className="p-2 flex w-full justify-content-center"
          style={{ height: "40%" }}
        >
          <div className="flex ">
            {/* Gênero */}
            <div className="p-2 flex flex-column gap-2">
              <Button
                icon="icon-female"
                aria-label="Filter"
                label="Feminino"
                value={"FEMININO"}
                onClick={() => changeGrupo("FEMININO", 2)}
                {...(!grupo.includes("FEMININO") && { outlined: true })}
              />
              <Button
                icon="icon-male"
                aria-label="Filter"
                label="Masculino"
                value={"MASCULINO"}
                onClick={() => changeGrupo("MASCULINO", 2)}
                {...(!grupo.includes("MASCULINO") && { outlined: true })}
              />
              <Button
                icon="icon-baby"
                aria-label="Filter"
                label="Baby"
                value={"BABY"}
                onClick={() => changeGrupo("BABY", 2)}
                {...(!grupo.includes("BABY") && { outlined: true })}
              />
              <Button
                icon="icon-child"
                aria-label="Filter"
                label="Infantil"
                value={"INFANTIL"}
                onClick={() => changeGrupo("INFANTIL", 2)}
                {...(!grupo.includes("INFANTIL") && { outlined: true })}
              />
              <Button
                icon="icon-unisex"
                aria-label="Filter"
                label="Unissex"
                value={"UNISSEX"}
                onClick={() => changeGrupo("UNISSEX", 2)}
                {...(!grupo.includes("UNISSEX") && { outlined: true })}
              />
            </div>
            {/* Tipo */}
            <div className="p-2 flex flex-column gap-2">
              <Button
                icon="icon-chinelo"
                aria-label="Filter"
                label="Chinelo"
                value={"CHINELO DEDO"}
                onClick={() => changeGrupo("CHINELO DEDO", 3)}
                {...(!grupo.includes("CHINELO DEDO") && { outlined: true })}
              />
              <Button
                icon="icon-sandalia"
                aria-label="Filter"
                value={"SANDÁLIA"}
                onClick={() => changeGrupo("SANDÁLIA", 3)}
                {...(!grupo.includes("SANDÁLIA") && { outlined: true })}
                label="Sandália"
              />
              <Button
                icon="icon-slide"
                aria-label="Filter"
                value={"CHINELO GÁSPEA/SLIDE"}
                onClick={() => changeGrupo("CHINELO GÁSPEA/SLIDE", 3)}
                {...(!grupo.includes("CHINELO GÁSPEA/SLIDE") && {
                  outlined: true,
                })}
                label="Slide"
              />
              <Button
                icon="icon-rasteira"
                aria-label="Filter"
                value={"RASTEIRA"}
                onClick={() => changeGrupo("RASTEIRA", 3)}
                {...(!grupo.includes("RASTEIRA") && { outlined: true })}
                label="Rasteira"
              />
              <Button
                icon="icon-tamanco"
                aria-label="Filter"
                value={"TAMANCO"}
                onClick={() => changeGrupo("TAMANCO", 3)}
                {...(!grupo.includes("TAMANCO") && { outlined: true })}
                label="Tamanco"
              />
              <Button
                icon="icon-babuch"
                aria-label="Filter"
                value={"BABUCH"}
                onClick={() => changeGrupo("BABUCH", 3)}
                {...(!grupo.includes("BABUCH") && { outlined: true })}
                label="Babuche"
              />
              <Button
                icon="icon-bota"
                aria-label="Filter"
                value={"BOTA"}
                onClick={() => changeGrupo("BOTA", 3)}
                {...(!grupo.includes("BOTA") && { outlined: true })}
                label="Bota"
              />
              <Button
                icon="icon-sapatilha"
                aria-label="Filter"
                value={"SAPATILHA"}
                onClick={() => changeGrupo("SAPATILHA", 3)}
                {...(!grupo.includes("SAPATILHA") && { outlined: true })}
                label="Sapatilha"
              />
              <Button
                icon="icon-sapato"
                aria-label="Filter"
                value={"SAPATO"}
                onClick={() => changeGrupo("SAPATO", 3)}
                {...(!grupo.includes("SAPATO") && { outlined: true })}
                label="Sapato"
              />
            </div>
          </div>
          <div
            className="flex flex-column align-items-center p-2 gap-2"
            style={{ width: "550px" }} // largura reduzida
          >
            <InputText
              className="w-full"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Dropdown
              value={cores}
              options={cores}
              onChange={(e) => setCores(e.value)}
              placeholder="Selecione uma cor"
              className="w-full"
            />
            <div className="flex w-full gap-2">
              <InputText
                className="w-full"
                value={novaCor}
                onChange={(e) => setNovaCor(e.target.value)}
              />
              <Button icon="pi pi-plus" aria-label="Filter" />
            </div>
            <DataTable className="w-full" scrollHeight="200px" value={grade}>
              <Column
                field="NUMERO"
                header="Número"
                style={{ width: "50px", padding: "2px" }}
              />
              <Column
                field="QUANTIDADE"
                header="Quantidade"
                style={{ width: "50px", padding: "2px" }}
              />
            </DataTable>
          </div>
          <div
            className="result-card flex align-items-center gap-3 p-3 border-round border-1 surface-border bg-white shadow-2"
            style={{ minWidth: 300, minHeight: 80, width: 400 }}
          >
            <div>
              <div className="font-bold text-lg mb-2">
                Nome formatado: <br />
                <span className="text-primary">{makeNomeFormatado()}</span>
              </div>
              <div className="mb-1">
                Pai: <br />
                <span className="font-medium">
                  {produtos[0]?.PROD_CODFABRIC + "-GREN-" + "PAI"}
                </span>
              </div>
              <div>
                Cor: <br />
                <span className="font-medium">
                  {produtos[0]?.COR_DESCRICAO || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex w-full justify-content-center">
          {" "}
          {/* w-screen -> w-full */}
          <DataTable
            value={produtos}
            loading={carregando}
            scrollable
            scrollHeight="400px"
            selection={selectedProdutos}
            selectionMode="multiple"
            onSelectionChange={selecionarProdutos}
            className="w-full"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="ID_CODPRODUTO" header="SKU" />
            <Column field="PROD_DESCRCOMPLETA" header="Descrição" />
            <Column field="SKU_PRODUTO_PAI" header="Pai" />
            <Column field="COR_DESCRICAO" header="Cor" />
            <Column body={renderizarCheckboxAtivo} header="Ativo" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default CadastroWeb;
