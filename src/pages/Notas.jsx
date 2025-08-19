import BarraLateral from "../components/BarraLateral";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import Content from "../components/Content";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect, useCallback } from "react";
import ufsJson from "../assets/json/ufs.json";
import vendedoresJson from "../assets/json/vendedores.json";
import transportadorasJson from "../assets/json/transportadoras.json";
import { FilterMatchMode } from "primereact/api";

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [uf, setUf] = useState(null);
  const ufs = ufsJson;
  const [vendedor, setVendedor] = useState(null);
  const vendedores = vendedoresJson;
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  // Recupera função do usuário do localStorage
  let idFuncaoUsuario = null;
  try {
    idFuncaoUsuario = parseInt(localStorage.getItem("userFuncao"));
  } catch {}

  const search = () => {
    // Não converta para Date aqui, apenas envie o valor do estado
    const nota = {
      numero: document.getElementById("inputNumero").value || null,
      cnpj: document.getElementById("inputCnpj").value || null,
      dataInicial: data ? (data[0] ? data[0].toISOString() : null) : null,
      dataFinal: data ? (data[1] ? data[1].toISOString() : null) : null,
      uf: uf || null,
      vendedor: vendedor || null,
    };
    console.log("Pesquisando nota:", nota);

    window.electronApi?.searchNota(nota);
    window.electronApi?.onSearchNotaResponse((notas) => {
      setNotas(notas);
      console.log("Notas recebidas:", notas);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputNumero").value = "";
      document.getElementById("inputCnpj").value = "";
      setData(null);
      setUf(null);
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
      document.getElementById("inputUf"),
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

  useEffect(() => {
    if (idFuncaoUsuario === 2) {
      const nome = localStorage.getItem("user");
      const v = vendedoresJson.find((v) => v.label === nome)?.value;
      setVendedor(v);
    }
  }, [idFuncaoUsuario]);

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputNumero" />
          <label htmlFor="inputNumero">Número</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar
            id="inputDataInicial"
            dateFormat="dd/mm"
            selectionMode="range"
            value={data}
            onChange={(e) => setData(e.value)}
          />
          <label htmlFor="inputDataInicial">Data</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            id="inputUf"
            options={ufs}
            className="md:w-12rem "
            value={uf}
            onChange={(e) => setUf(e.value)}
          />
          <label htmlFor="inputUf">UF</label>
        </FloatLabel>
        {idFuncaoUsuario !== 2 && (
          <FloatLabel>
            <Dropdown
              id="inputVendedor"
              options={vendedores}
              className="md:w-12rem "
              value={vendedor}
              onChange={(e) => setVendedor(e.value)}
            />
            <label htmlFor="inputVendedor">Vendedor</label>
          </FloatLabel>
        )}
      </BarraLateral>
      <Content titulo={"Notas Fiscais"}>
        <DataTable
          id="tabelaNotas"
          value={notas}
          paginator
          rows={10}
          emptyMessage="Nenhum produto encontrado"
          showGridlines
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "NF_NUMDOCUM",
            "ID_PEDIDO",
            "NF_CGCCPFENTIDADE",
            "NF_NOMEENTIDADE",
            "NF_UNIDFEDENTD",
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
              placeholder="Filtrar notas fiscais"
            />
          }
        >
          <Column field="NF_NUMDOCUM" header="Número" />
          <Column field="ID_PEDIDO" header="Pedido" />
          <Column field="NF_CGCCPFENTIDADE" header="CNPJ" />
          <Column
            body={(rowData) => rowData.NF_NOMEENTIDADE?.substring(0, 20)}
            header="Nome do Cliente"
          />
          <Column field="NF_UNIDFEDENTD" header="UF" />
          <Column
            field="NF_DATAEMIS"
            header="Data de Emissão"
            body={(rowData) => {
              if (!rowData.NF_DATAEMIS) return "";
              // Se for Date, converte para string legível
              if (rowData.NF_DATAEMIS instanceof Date) {
                return rowData.NF_DATAEMIS.toLocaleDateString();
              }
              // Se vier string ISO, formata
              if (typeof rowData.NF_DATAEMIS === "string") {
                const d = new Date(rowData.NF_DATAEMIS);
                if (!isNaN(d)) return d.toLocaleDateString();
                return rowData.NF_DATAEMIS;
              }
              return rowData.NF_DATAEMIS;
            }}
          />
          <Column
            body={(rowData) => {
              return (
                vendedoresJson.find((v) => v.value === rowData.ID_CODVENDEDOR)
                  ?.label || "Desconhecido"
              );
            }}
            header="Vendedor"
          />
          <Column
            body={(rowData) => {
              return (
                rowData.NF_VLRTOTAL?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) || "R$ 0,00"
              );
            }}
            header="Valor Total"
          />
          <Column
            body={(rowData) => {
              return (
                "kg " +
                  rowData.NF_PESOBRUTO?.toLocaleString("pt-BR", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "kg 0,00"
              );
            }}
            header="Peso bruto"
          />
          <Column
            body={(rowData) => {
              return (
                transportadorasJson.transportadoras.find(
                  (t) => t.id === rowData.ID_CODTRANSP
                )?.nome || "Desconhecida"
              );
            }}
            header="Transportadora"
          />
        </DataTable>
      </Content>
    </div>
  );
};

export default Notas;
