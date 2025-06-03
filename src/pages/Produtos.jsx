import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import Content from "../components/Content";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect, useCallback } from "react";
import { FilterMatchMode } from "primereact/api";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ID_CODPRODUTO: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PROD_CODFABRIC: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PROD_DESCRCOMPLETA: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PROD_CODBARRA: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const search = () => {
    const produto = {
      referencia: document.getElementById("inputReferencia").value || null,
      codigoInterno:
        document.getElementById("inputCodigoInterno").value || null,
      nome: document.getElementById("inputNome").value || null,
      codigoBarras: document.getElementById("inputCodigoBarras").value || null,
    };

    window.electronApi?.searchProduto(produto);
    window.electronApi?.onSearchProdutoResponse((produtos) => {
      setProdutos(produtos);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputReferencia").value = "";
      document.getElementById("inputCodigoInterno").value = "";
      document.getElementById("inputNome").value = "";
      document.getElementById("inputCodigoBarras").value = "";
    });
  };

  // Permite pesquisar ao pressionar Enter em qualquer campo
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      search();
    }
  }, []);

  useEffect(() => {
    const inputs = [
      document.getElementById("inputReferencia"),
      document.getElementById("inputCodigoInterno"),
      document.getElementById("inputNome"),
      document.getElementById("inputCodigoBarras"),
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
          <InputText id="inputCodigoInterno" />
          <label htmlFor="inputCodigoInterno">Código Interno</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputNome" />
          <label htmlFor="inputNome">Nome</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCodigoBarras" />
          <label htmlFor="inputCodigoBarras">Código de Barras</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Produtos"}>
        <DataTable
          value={produtos}
          paginator
          rows={10}
          emptyMessage="Nenhum produto encontrado"
          showGridlines
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "ID_CODPRODUTO",
            "PROD_CODFABRIC",
            "PROD_DESCRCOMPLETA",
            "PROD_CODBARRA",
          ]}
          header={
            <span>
              <InputText
                type="search"
                onInput={(e) =>
                  setFilters({
                    ...filters,
                    global: {
                      value: e.target.value,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  })
                }
                placeholder="Filtrar produtos"
              />
            </span>
          }
        >
          <Column field="ID_CODPRODUTO" header="Código Interno" />
          <Column field="PROD_CODFABRIC" header="Referência" />
          <Column field="PROD_DESCRCOMPLETA" header="Nome" />
          <Column field="PROD_CODBARRA" header="Código de Barras" />
          <Column
            header="Endereço"
            body={(rowData) => {
              return `${rowData.PRDE_RUA?.substring(0, 1) || ""} - ${
                rowData.PRDE_FILEIRA?.substring(0, 2) || ""
              }`;
            }}
          />
          <Column
            header="Quantidade"
            body={(rowData) => {
              const total = Number(rowData.PROD_ESTATUAL) || 0;
              const reserva = Number(rowData.EST_QUANTIDADE) || 0;
              return total - reserva;
            }}
          />
        </DataTable>
      </Content>
    </div>
  );
};

export default Produtos;
