import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import PopUp from "../components/PopUp";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useCallback, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import vendedoresJson from "../assets/json/vendedores.json";
import { Button } from "primereact/button";
import createPDF from "../utils/createPDF";
const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [situacao, setSituacao] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);
  const [cubagemItens, setCubagemItens] = useState([]);

  const search = () => {
    const pedido = {
      numero: document.getElementById("inputNumero").value || null,
      cnpj: document.getElementById("inputCnpj").value || null,
      dataInicial: dataInicial ? dataInicial.toISOString() : null,
      dataFinal: dataFinal && dataInicial ? dataFinal.toISOString() : null,
      situacao: situacao || null,
      vendedor: vendedor || null,
    };
    if (
      !pedido.numero &&
      !pedido.cnpj &&
      !pedido.dataInicial &&
      !pedido.dataFinal &&
      !pedido.situacao &&
      !pedido.vendedor
    ) {
      console.warn("Nenhum filtro aplicado.");
      return;
    }

    window.electronApi?.searchPedido(pedido);
    window.electronApi?.onSearchPedidoResponse((pedidos) => {
      setPedidos(pedidos);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputNumero").value = "";
      document.getElementById("inputCnpj").value = "";
      setDataInicial(null);
      setDataFinal(null);
      document.getElementById("inputSituacao").value = "";
      setVendedor(null);
    });
  };
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      search();
    }
  }, []);

  useEffect(() => {
    const inputs = [
      document.getElementById("inputNumero"),
      document.getElementById("inputCnpj"),
      document.getElementById("inputDataInicial"),
      document.getElementById("inputDataFinal"),
      document.getElementById("inputSituacao"),
      document.getElementById("inputVendedor"),
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
  const getPedido = (numero) => {
    openPopup();
    window.electronApi?.getPedido(numero);
    window.electronApi?.onGetPedidoResponse((itensPedido) => {
      setItensPedido(itensPedido || []);
    });
  };
  useEffect(() => {
    if (!window.electronApi) return;

    const handleCubagem = (cubagemItens) => {
      // Agrupa por PROD_CODFABRIC e soma a quantidade
      const agrupado = {};
      cubagemItens.forEach((item) => {
        const cod = item.PROD_CODFABRIC;
        if (!agrupado[cod]) {
          agrupado[cod] = {
            PROD_CODFABRIC: item.PROD_CODFABRIC,
            PROD_ALTURA: item.PROD_ALTURA,
            PROD_COMPRIMENTO: item.PROD_COMPRIMENTO,
            PROD_LARGURA: item.PROD_LARGURA,
            ITPEDOR_QUANTID: item.ITPEDOR_QUANTID,
          };
        } else {
          agrupado[cod].ITPEDOR_QUANTID += item.ITPEDOR_QUANTID;
        }
      });

      const cubagemComSoma = Object.values(agrupado);
      console.log("Dados de cubagem recebidos:", cubagemComSoma);

      let cubagem = 0;
      cubagemComSoma.forEach((item) => {
        const volume =
          (item.PROD_ALTURA * item.PROD_COMPRIMENTO * item.PROD_LARGURA) /
          1000000;
        cubagem += volume * (item.ITPEDOR_QUANTID / 12);
      });

      setCubagemItens(cubagemComSoma);
      createPDF(cubagemComSoma, cubagem);
    };

    // Remova antes de adicionar (se existir esse método)
    if (window.electronApi.removeMakeCubagemResponse) {
      window.electronApi.removeMakeCubagemResponse(handleCubagem);
    }
    window.electronApi.onMakeCubagemResponse(handleCubagem);

    return () => {
      if (window.electronApi.removeMakeCubagemResponse) {
        window.electronApi.removeMakeCubagemResponse(handleCubagem);
      }
    };
  }, []);

  const makeCubagem = async () => {
    window.electronApi?.makeCubagem(itensPedido);
  };
  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputNumero" />
          <label htmlFor="inputNumero">Número do Pedido</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar
            id="inputDataInicial"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.value)}
          />
          <label htmlFor="inputDataInicial">Data Inicial</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar
            id="inputDataFinal"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.value)}
          />
          <label htmlFor="inputDataFinal">Data Final</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            className="md:w-12rem "
            options={[
              { label: "Pendente", value: "Pendente" },
              { label: "Cancelado", value: "Cancelado" },
              { label: "Atendido", value: "Atendido" },
            ]}
            id="inputSituacao"
            value={situacao}
            onChange={(e) => setSituacao(e.value)}
          />
          <label htmlFor="inputSituacao">Situação</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            options={vendedoresJson}
            id="inputVendedor"
            className="md:w-12rem "
            value={vendedor}
            onChange={(e) => setVendedor(e.value)}
          />
          <label htmlFor="inputVendedor">Vendedor</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Pedidos"}>
        <DataTable
          paginator
          rows={10}
          emptyMessage="Nenhum produto encontrado"
          value={pedidos}
          showGridlines
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "ID_NUMPEDORC",
            "ID_CODENTIDADE",
            "PEDOR_RAZAOSOCIAL",
            "PEDOR_SITUACAO",
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
              placeholder="Filtrar pedidos"
            />
          }
          id="tabelaPedidos"
          onRowClick={(e) => {
            getPedido(e.data.ID_NUMPEDORC);
          }}
        >
          <Column field="ID_NUMPEDORC" header="Número" />
          <Column field="ID_CODENTIDADE" header="ID do cliente" />
          <Column field="PEDOR_RAZAOSOCIAL" header="Nome" />
          <Column field="PEDOR_PESOBRUTO" header="Peso Bruto" />
          <Column
            body={(rowData) => {
              if (!rowData.PEDOR_DATA) return "";
              if (rowData.PEDOR_DATA instanceof Date) {
                return rowData.PEDOR_DATA.toLocaleDateString("pt-BR");
              }
              if (
                typeof rowData.PEDOR_DATA === "string" ||
                typeof rowData.PEDOR_DATA === "number"
              ) {
                const d = new Date(rowData.PEDOR_DATA);
                if (!isNaN(d)) return d.toLocaleDateString("pt-BR");
                return rowData.PEDOR_DATA;
              }
              return rowData.PEDOR_DATA;
            }}
            header="Data"
          />
          <Column field="PEDOR_SITUACAO" header="Situação" />
          <Column
            body={(rowData) =>
              vendedoresJson.find((v) => v.value === rowData.ID_CODVENDEDOR)
                ?.label || "Desconhecido"
            }
            header="Vendedor"
          />
        </DataTable>
      </Content>
      <PopUp onClose={closePopup}>
        <DataTable
          value={itensPedido}
          emptyMessage="Nenhum item encontrado"
          scrollHeight="500px"
        >
          <Column field="ID_CODPRODUTO" header="Código" />
          <Column field="ITPEDOR_DESCRPROD" header="Descrição" />
          <Column field="ITPEDOR_QUANTID" header="Quantidade" />
          <Column field="ITPEDOR_VLRUNIT" header="Valor unitário" />
          <Column field="ITPEDOR_VLRLIQU" header="Valor líquido" />
        </DataTable>
        <Button icon="fa fa-box" label="Cubagem" onClick={makeCubagem} />
      </PopUp>
    </div>
  );
};

export default Pedidos;
