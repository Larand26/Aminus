import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";

const Produtos = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [codBarras, setCodBarras] = useState("");
  const [nome, setNome] = useState("");

  // Produtos
  const [produtos, setProdutos] = useState([
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "002", b: "1002", c: "7891234567891", d: "Produto B" },
    { a: "003", b: "1003", c: "7891234567892", d: "Produto C" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "002", b: "1002", c: "7891234567891", d: "Produto B" },
    { a: "003", b: "1003", c: "7891234567892", d: "Produto C" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "002", b: "1002", c: "7891234567891", d: "Produto B" },
    { a: "003", b: "1003", c: "7891234567892", d: "Produto C" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "002", b: "1002", c: "7891234567891", d: "Produto B" },
    { a: "003", b: "1003", c: "7891234567892", d: "Produto C" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
    { a: "001", b: "1001", c: "7891234567890", d: "Produto A" },
  ]);
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral search={true}>
          <InputLabel
            label="Cod Fabricante"
            value={codFabricante}
            onChange={setCodFabricante}
          />
          <InputLabel
            label="Cod Interno"
            value={codInterno}
            onChange={setCodInterno}
          />
          <InputLabel
            label="Cod Barras"
            value={codBarras}
            onChange={setCodBarras}
          />
          <InputLabel label="Nome" value={nome} onChange={setNome} />
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Produtos</h1>
          </div>
          <Tabela dados={produtos} semDados="Nenhum produto encontrado">
            <Coluna titulo="Cod Fabricante" campo="a" />
            <Coluna titulo="Cod Interno" campo="b" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Cod Barras" campo="c" />
            <Coluna titulo="Nome" campo="d" />
          </Tabela>
        </div>
      </div>
    </>
  );
};

export default Produtos;
