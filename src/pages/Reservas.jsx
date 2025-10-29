import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";
import SelectLabel from "../components/SelectLabel";
import InputDataLabel from "../components/InputDataLabel";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import PopUp from "../components/PopUp";

import vendedoresJson from "../assets/json/vendedores.json";
import opcoesReserva from "../assets/json/opcoes/opcoesReserva.json";

import searchReservas from "../utils/search/searchReservas";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import searchData from "../utils/search/searchData";

import "../styles/reservas.css";

const Reservas = () => {
  // Estados dos inputs
  const [codFabricante, setCodFabricante] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [numPedido, setNumPedido] = useState("");
  const [nomePedido, setNomePedido] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Loading
  const [isLoading, setIsLoading] = useState(false);

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

  // PopUp
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const openPopUp = (item) => {
    setPedidoSelecionado(item);
    document.querySelector(`#popup-reservas`).classList.add("open-pop-up");
    document.querySelector(".blur").classList.add("open-blur");
  };

  const handleClosePopUp = () => {
    setDataReservaResponse("Selecione uma data");
  };

  // Data Reserva
  const [dataReserva, setDataReserva] = useState([null, null]);
  const [dataReservaResponse, setDataReservaResponse] =
    useState("Selecione uma data");

  const handleSearchData = async () => {
    const filters = {
      codInterno: pedidoSelecionado.COD_INTERNO || null,
      numPedido: pedidoSelecionado.NUM_PEDIDO || null,
      dataPesquisa: dataReserva || null,
    };

    const results = await searchData(filters);

    if (results.success) {
      setDataReservaResponse(results.data);
      console.log(results.data);
    } else {
      setDataReservaResponse("Erro ao buscar dados");
    }
  };

  return (
    <>
      <PopUp
        id="popup-reservas"
        width="400px"
        height="250px"
        onClose={handleClosePopUp}
      >
        <h2>Consulte a data da reserva</h2>
        <div className="content-popup-reservas">
          <InputDataLabel value={dataReserva} onChange={setDataReserva} />
          <button className="btn-consulta-reserva" onClick={handleSearchData}>
            <i className="fa fa-search" />
          </button>
        </div>
        <div>
          {Array.isArray(dataReservaResponse) && dataReservaResponse.length > 0
            ? new Date(dataReservaResponse[0].DATA).toLocaleString("pt-BR")
            : dataReservaResponse}
        </div>
        <div className="footer-popup-reservas"></div>
      </PopUp>
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
          <Tabela
            dados={reservas}
            semDados="Nenhuma reserva encontrada"
            hover
            loading={isLoading}
          >
            {opcoes
              .filter((opcao) => opcao.checked)
              .map((opcao) => (
                <Coluna
                  key={opcao.id}
                  titulo={opcao.label}
                  campo={opcao.id}
                  format={opcao.format || ""}
                  dados={opcao.dados || []}
                  onClick={openPopUp}
                />
              ))}
          </Tabela>
        </div>
      </div>
    </>
  );
};
export default Reservas;
