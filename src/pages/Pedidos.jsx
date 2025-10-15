import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";

const Pedidos = () => {
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral></BarraLateral>
      </div>
    </>
  );
};

export default Pedidos;
