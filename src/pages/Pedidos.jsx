import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";

import searchPedidos from "../utils/search/searchPedidos";
import atualizaOpcoes from "../utils/atualizaOpcoes";

import vendedoresJson from "../assets/json/vendedores.json";

import opcoesPedidos from "../assets/json/opcoes/opcoesPedidos.json";

const Pedidos = () => {
  // Estados dos inputs
  const [numPedido, setNumPedido] = useState("");
  const [data, setData] = useState([null, null]);
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Pedidos
  const [pedidos, setPedidos] = useState([]);

  const handleSearch = async () => {
    const filters = {
      numPedido: numPedido,
      dataInicial: data[0],
      dataFinal: data[1],
      cliente: cliente,
      cnpj: cnpj,
      vendedor: vendedor,
    };

    const results = await searchPedidos(filters);
    setPedidos(results.data);
    console.log(results);
  };

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesPedidos");
    return atualizaOpcoes(opcoesPedidos, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesPedidos", JSON.stringify(updatedOptions));
  };

  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
          <InputLabel
            label="Num Pedido"
            value={numPedido}
            onChange={setNumPedido}
          />
          <InputDataLabel label="Data" value={data} onChange={setData} />
          <InputLabel label="Cliente" value={cliente} onChange={setCliente} />
          <InputLabel label="CNPJ" value={cnpj} onChange={setCnpj} />
          <SelectLabel
            options={vendedoresJson}
            label="Vendedor"
            value={vendedor}
            onChange={setVendedor}
          />
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Pedidos</h1>
          </div>
          <Tabela dados={pedidos} semDados="Nenhum pedido encontrado">
            {opcoes
              .filter((opcao) => opcao.checked)
              .map((opcao) => (
                <Coluna
                  key={opcao.id}
                  titulo={opcao.label}
                  campo={opcao.id}
                  format={opcao.format || ""}
                  dados={opcao.dados || []}
                />
              ))}
          </Tabela>
        </div>
      </div>
    </>
  );
};

export default Pedidos;
