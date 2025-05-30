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

const Notas = () => {
  const [uf, setUf] = useState(null);
  const ufs = ufsJson;
  const [vendedor, setVendedor] = useState(null);
  const vendedores = vendedoresJson;

  const search = () => {
    const nota = {
      numero: document.getElementById("inputNumero").value || null,
      cnpj: document.getElementById("inputCnpj").value || null,
      dataInicial: document.getElementById("inputDataInicial").value || null,
      dataFinal: document.getElementById("inputDataFinal").value || null,
      uf: uf ? uf.sigla : null,
      vendedor: vendedor ? vendedor.id : null,
    };
    console.log(nota);

    window.electronApi?.searchNota(nota);
    window.electronApi?.onSearchNotaResponse((notas) => {
      // Aqui você pode atualizar o estado com as notas recebidas
      console.log(notas);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputNumero").value = "";
      document.getElementById("inputCnpj").value = "";
      document.getElementById("inputDataInicial").value = "";
      document.getElementById("inputDataFinal").value = "";
      setUf(null);
      setVendedor(null);
    });
  };

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
          <Calendar id="inputDataInicial" dateFormat="dd/mm/yy" />
          <label htmlFor="inputDataInicial">Data inicial</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar id="inputDataFinal" dateFormat="dd/mm/yy" />
          <label htmlFor="inputDataFinal">Data Final</label>
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
      </BarraLateral>
      <Content>
        <DataTable
          id="tabelaNotas"
          value={[]}
          paginator
          rows={10}
          emptyMessage="Nenhum produto encontrado"
          sortMode="multiple"
          showGridlines
        >
          <Column field="numero" header="Número" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="dataEmissao" header="Data de Emissão" />
          <Column field="valorTotal" header="Valor Total" />
          <Column field="situacao" header="Situação" />
        </DataTable>
      </Content>
    </div>
  );
};

export default Notas;
