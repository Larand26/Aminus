import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const CadastroWeb = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [selectedProdutos, setSelectedProdutos] = useState([]);

  const search = () => {
    setCarregando(true);
    window.electronApi?.searchCadastroProdutos(referencia);
    window.electronApi?.onSearchCadastroProdutosResponse((produtos) => {
      setProdutos(produtos);
      setCarregando(false);
    });
  };

  // Handler para selecionar todos ao clicar no primeiro radio
  const onSelectionChange = (e) => {
    if (e.value.length === 1 && e.value[0] === produtos[0]) {
      setSelectedProdutos(produtos); // Seleciona todos
    } else {
      setSelectedProdutos(e.value);
    }
  };

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="inputNome"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <label htmlFor="inputNome">Referência</label>
        </FloatLabel>
      </BarraLateral>
      <div>
        <div></div>
        <div>
          <DataTable
            value={produtos}
            loading={carregando}
            scrollable
            scrollHeight="400px" // Defina a altura desejada
            selection={selectedProdutos}
            selectionMode="multiple"
            onSelectionChange={onSelectionChange}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="ID_CODPRODUTO" header="SKU" />
            <Column field="PROD_DESCRCOMPLETA" header="Descrição" />
            <Column field="SKU_PRODUTO_PAI" header="Pai" />
            <Column field="COR_DESCRICAO" header="Cor" />
            <Column body={"aa"} header="Ativo" />
            <Column field="PRO_ATIVO_ECOMMERCE" header="Ativo" />
            <Column field="PRO_INTEGRACAO_ECOMMERCE" header="Integração" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default CadastroWeb;
