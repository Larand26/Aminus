import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";

import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const CadastroWeb = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [selectedProdutos, setSelectedProdutos] = useState([]);

  const buscarProdutos = () => {
    setCarregando(true);
    window.electronApi?.searchCadastroProdutos(referencia);
    window.electronApi?.onSearchCadastroProdutosResponse((produtos) => {
      setProdutos(produtos);
      setCarregando(false);
    });
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
      <div className="content flex flex-column align-items-center justify-content-center w-full min-h-screen bg-gray-200 p-4">
        <div className="p-2 flex w-screen justify-content-center">
          <div className="flex ">
            {/* Gênero */}
            <div className="p-1 flex flex-column gap-2">
              <Button icon="fa fa-person-dress" aria-label="Filter" outlined />
              <Button icon="fa fa-person" aria-label="Filter" outlined />
              <Button icon="fa fa-baby" aria-label="Filter" outlined />
              <Button icon="fa fa-child" aria-label="Filter" outlined />
              <Button icon="fa fa-check" aria-label="Filter" outlined />
            </div>
            {/* Tipo */}
            <div className="p-1 flex flex-column gap-2">
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
              <Button icon="pi pi-check" aria-label="Filter" outlined />
            </div>
          </div>
        </div>
        <div className="p-4 flex w-screen justify-content-center">
          <DataTable
            value={produtos}
            loading={carregando}
            scrollable
            scrollHeight="400px" // Defina a altura desejada
            selection={selectedProdutos}
            selectionMode="multiple"
            onSelectionChange={selecionarProdutos}
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
