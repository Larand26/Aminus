import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";

import vendedoresJson from "../assets/json/vendedores.json";
import opcoesReserva from "../assets/json/opcoes/opcoesReserva.json";

import searchReservas from "../utils/search/searchReservas";
import atualizaOpcoes from "../utils/atualizaOpcoes";

const Reservas = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [numPedido, setNumPedido] = useState("");
  const [nomePedido, setNomePedido] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Reservas
  const [reservas, setReservas] = useState([]);

  const handleSearch = async () => {
    const filters = {
      codFabricante: codFabricante,
      codInterno: codInterno,
      numPedido: numPedido,
      nomePedido: nomePedido,
      vendedor: vendedor,
    };

    const results = await searchReservas(filters);
    setReservas(results.data);
    console.log(results);
  };

  //Opções
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesReserva");
    return atualizaOpcoes(opcoesReserva, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesReserva", JSON.stringify(updatedOptions));
  };

  return (
    <>
      <Configuracoes>
        {opcoes.map((opcao) => (
          <Opcao
            key={opcao.id}
            id={opcao.id}
            label={opcao.label}
            checked={opcao.checked}
            onChange={handleOptionClick}
          />
        ))}
      </Configuracoes>
      <NavBar />
      <div className="main-container">
        <BarraLateral onSearch={handleSearch}>
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
            label="Num Pedido"
            value={numPedido}
            onChange={setNumPedido}
          />
          <InputLabel
            label="Nome Pedido"
            value={nomePedido}
            onChange={setNomePedido}
          />
          <SelectLabel
            label="Vendedor"
            options={vendedoresJson}
            value={vendedor}
            onChange={setVendedor}
          />
        </BarraLateral>
        <div className="content">
          <div className="content-title">
            <h1>Reservas</h1>
          </div>
          <Tabela dados={reservas} semDados="Nenhuma reserva encontrada">
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
export default Reservas;
