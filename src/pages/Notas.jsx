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

  return (
    <div>
      <BarraLateral>
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
    </div>
  );
};

export default Notas;
