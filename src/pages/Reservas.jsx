import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";

import vendedoresJson from "../assets/json/vendedores.json";

const Reservas = () => {
  return (
    <>
      <NavBar />
      <BarraLateral onSearch={() => {}}>
        <InputLabel label="Cod Fabricante" />
        <InputLabel label="Cod Interno" />
        <InputLabel label="Num Pedido" />
        <InputLabel label="Nome Pedido" />
        <SelectLabel label="Vendedor" options={vendedoresJson} />
      </BarraLateral>
    </>
  );
};
export default Reservas;
