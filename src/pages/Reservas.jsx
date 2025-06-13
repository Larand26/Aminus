import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import PopUp from "../components/PopUp";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import vendedoresJson from "../assets/json/vendedores.json";

const Reserva = () => {
  const [reservas, setReservas] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dataReserva, setDataReserva] = useState({});
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
      document.getElementById("inputNumeroPedido"),
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
  const closePopup = () => {
    document.getElementById("popup").style.transform = "scale(0)";
  };
  const openPopup = () => {
    document.getElementById("popup").style.transform = "scale(1)";
  };
  const getDataReserva = (idCodProduto, idNumPedOrc) => {
    window.electronApi?.getDataReserva(idCodProduto, idNumPedOrc);
    window.electronApi?.onGetDataReservaResponse((data) => {
      if (data.length === 0) {
        setDataReserva({ DATA: "Nenhuma reserva encontrada." });
        return;
      }
      setDataReserva(data[0].DATA);
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
          paginator
          rows={10}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "ID_CODPRODUTO",
            "PROD_CODFABRIC",
            "ID_NUMPEDORC",
            "PEDOR_RAZAOSOCIAL",
          ]}
          onRowClick={(e) => {
            openPopup();
            getDataReserva(e.data.ID_CODPRODUTO, e.data.ID_NUMPEDORC);
          }}
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
          <Column
            body={(rowData) => rowData.ID_CODPRODUTO || "U"}
            header="Código Interno"
          />
          <Column
            body={(rowData) => rowData.PROD_CODFABRIC || "U"}
            header="Referência"
          />
          <Column
            body={(rowData) => rowData.ID_NUMPEDORC || "U"}
            header="Número do Pedido"
          />
          <Column
            body={(rowData) => rowData.PEDOR_RAZAOSOCIAL || "U"}
            header="Nome"
          />
          <Column
            body={(rowData) => {
              const vendedor = vendedoresJson.find(
                (v) => v.value === rowData.ID_CODVENDEDOR
              );
              return vendedor ? vendedor.label : "U";
            }}
            header="Vendedor"
          />
          <Column
            body={(rowData) => rowData.EST_QUANTIDADE || "U"}
            header="Quantidade"
          />
          <Column
            body={(rowData) =>
              rowData.PEDOR_DATAALTERACAO
                ? rowData.PEDOR_DATAALTERACAO.toLocaleDateString("pt-BR")
                : "U"
            }
            header="Alteração do pedido"
          />
        </DataTable>
      </Content>
      <PopUp onClose={closePopup} onOpen={openPopup}></PopUp>
    </div>
  );
};

export default Reserva;
