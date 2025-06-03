import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import vendedoresJson from "../assets/json/vendedores.json";

const Reserva = () => {
  const [reservas, setReservas] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const search = () => {
    const reserva = {
      referencia: document.getElementById("inputReferencia").value || null,
      codigoInterno:
        document.getElementById("inputCodigoInterno").value || null,
      nome: document.getElementById("inputNome").value || null,
      numeroPedido: document.getElementById("inputNumeroPedido").value || null,
    };

    window.electronApi?.searchReserva(reserva);
    window.electronApi?.onSearchReservaResponse((reservas) => {
      setReservas(reservas);
      console.log(reservas);

      // Limpa os inputs após a pesquisa
      document.getElementById("inputReferencia").value = "";
      document.getElementById("inputCodigoInterno").value = "";
      document.getElementById("inputNome").value = "";
      document.getElementById("inputNumeroPedido").value = "";
    });
  };
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
          <InputText id="inputNumeroPedido" />
          <label htmlFor="inputNumeroPedido">Número do Pedido</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo="Produtos na reserva">
        <DataTable
          value={reservas}
          className="w-full"
          emptyMessage="Nenhuma reserva encontrada."
          showGridlines
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "ID_CODPRODUTO",
            "PROD_CODFABRIC",
            "ID_NUMPEDORC",
            "PEDOR_RAZAOSOCIAL",
          ]}
          header={
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
              placeholder="Filtrar reservas"
            />
          }
        >
          <Column field="ID_CODPRODUTO" header="Código Interno" />
          <Column field="PROD_CODFABRIC" header="Referência" />
          <Column field="ID_NUMPEDORC" header="Número do Pedido" />
          <Column field="PEDOR_RAZAOSOCIAL" header="Nome" />
          <Column
            body={(rowData) => {
              const vendedor = vendedoresJson.find(
                (v) => v.value === rowData.ID_CODVENDEDOR
              );
              return vendedor ? vendedor.label : "";
            }}
            header="Vendedor"
          />
          <Column field="EST_QUANTIDADE" header="Quantidade" />
          <Column
            body={(rowData) =>
              rowData.DATAALTERACAO.toLocaleDateString("pt-BR")
            }
            header="Data da Reserva"
          />
        </DataTable>
      </Content>
    </div>
  );
};

export default Reserva;
