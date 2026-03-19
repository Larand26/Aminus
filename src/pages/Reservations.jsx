import { useState } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/SideBar";
import InputLabel from "../components/inputs/InputText";
import SelectLabel from "../components/inputs/Select";
import InputDataLabel from "../components/inputs/InputDate";
import Tabela from "../components/table/Table";
import PopUp from "../components/PopUp";
import Toast from "../components/Toast";
import Content from "../components/misc/Content";

import vendedoresJson from "../assets/json/vendedores.json";
import opcoesReserva from "../assets/json/opcoes/opcoesReserva.json";

import searchReservations from "../utils/search/searchReservas";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import searchDate from "../utils/search/searchData";

import "../styles/reservas.css";

const Reservations = () => {
  // Input states
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [seller, setSeller] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Reservations
  const [reservations, setReservations] = useState([]);

  // Popups
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);

  const handleSearch = async () => {
    setReservations([]);
    setIsLoading(true);
    const filters = {
      codFabricante: manufacturerCode,
      codInterno: internalCode,
      numPedido: orderNumber,
      nomeCliente: clientName,
      vendedor: seller,
    };

    const response = await searchReservations(filters);
    setIsLoading(false);

    if (response.success) {
      setReservations(response.data);
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No reservations found with the selected filters.",
          type: "aviso",
        });
      }
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching reservations.",
        type: "falha",
      });
    }
  };

  // Handles Enter key submit
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Options
  const [opcoes, setOpcoes] = useState(() => {
    const savedOpcoes = localStorage.getItem("opcoesReserva");
    return atualizaOpcoes(opcoesReserva, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesReserva", JSON.stringify(updatedOptions));
  };

  // PopUp
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openPopup = (item) => {
    setSelectedOrder(item);
    setIsDatePopupOpen(true);
  };

  const handleClosePopup = () => {
    setReservationDateResponse("Select a date");
  };

  // Reservation date
  const [reservationDate, setReservationDate] = useState([null, null]);
  const [reservationDateResponse, setReservationDateResponse] =
    useState("Select a date");

  const handleSearchData = async () => {
    const filters = {
      codInterno: selectedOrder.COD_INTERNO || null,
      numPedido: selectedOrder.NUM_PEDIDO || null,
      dataPesquisa: reservationDate || null,
    };

    const results = await searchDate(filters);

    if (results.success) {
      setReservationDateResponse(results.data);
      console.log(results.data);
    } else {
      setReservationDateResponse("Error while searching data");
    }
  };

  return (
    <>
      <PopUp
        id="popup-reservas"
        width="400px"
        height="250px"
        onClose={handleClosePopup}
        open={isDatePopupOpen}
        setOpen={setIsDatePopupOpen}
      >
        <h2>Check reservation date</h2>
        <div className="content-popup-reservas">
          <InputDataLabel
            value={reservationDate}
            onChange={setReservationDate}
          />
          <button className="btn-consulta-reserva" onClick={handleSearchData}>
            <i className="fa fa-search" />
          </button>
        </div>
        <div>
          {Array.isArray(reservationDateResponse) &&
          reservationDateResponse.length > 0
            ? new Date(reservationDateResponse[0].DATA).toLocaleString("pt-BR")
            : reservationDateResponse}
        </div>
        <div className="footer-popup-reservas"></div>
      </PopUp>
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
      <NavBar />
      <div className="main-container">
        <SideBar onSearch={handleSearch}>
          <InputLabel
            label="Manufacturer Code"
            value={manufacturerCode}
            onChange={setManufacturerCode}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Internal Code"
            value={internalCode}
            onChange={setInternalCode}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Order No."
            value={orderNumber}
            onChange={setOrderNumber}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Client Name"
            value={clientName}
            onChange={setClientName}
            onKeyDown={handleKeyDown}
          />
          <SelectLabel
            label="Seller"
            options={vendedoresJson}
            value={seller}
            onChange={setSeller}
            onKeyDown={handleKeyDown}
          />
        </SideBar>
        <Content titulo="Reservations">
          <Tabela
            dados={reservations}
            semDados="No reservations found"
            hover
            loading={isLoading}
            search={opcoes.find((opcao) => opcao.id === "search").checked}
          ></Tabela>
        </Content>
      </div>
    </>
  );
};
export default Reservations;
