import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

const Fotos = () => {
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={() => {}}>
          <InputLabel label="Cod Fabricante" value="" onChange={() => {}} />
          <InputLabel label="Cod Interno" value="" onChange={() => {}} />
          <InputLabel label="Cod Cor" value="" onChange={() => {}} />
        </BarraLateral>
      </div>
    </>
  );
};

export default Fotos;
