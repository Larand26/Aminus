import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import vendedoresJson from "../assets/json/vendedores.json";
const Pedidos = () => {
  return (
    <div className="flex">
      <BarraLateral>
        <FloatLabel>
          <InputText id="inputNumero" />
          <label htmlFor="inputNumero">Número do Pedido</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar id="inputDataInicial" />
          <label htmlFor="inputDataInicial">Data Inicial</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar id="inputDataFinal" />
          <label htmlFor="inputDataFinal">Data Final</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputSituacao" />
          <label htmlFor="inputSituacao">Situação</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            options={vendedoresJson}
            id="inputVendedor"
            className="md:w-12rem "
          />
          <label htmlFor="inputVendedor">Vendedor</label>
        </FloatLabel>
      </BarraLateral>
    </div>
  );
};

export default Pedidos;
