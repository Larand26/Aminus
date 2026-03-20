import { useState } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Tabela from "../components/table/Table";
import Select from "../components/inputs/Select";
import InputLabel from "../components/inputs/InputText";
import InputDataLabel from "../components/inputs/InputDate";
import Button from "../components/buttons/Button";
import Toast from "../components/misc/Toast";
import Content from "../components/misc/Content";

import searchOrders from "../utils/search/searchPedidos";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import getOrderItems from "../utils/getItensPedido";
import calculateQuote from "../utils/fazCotacao";
import calculateVolume from "../utils/fazCubagem";
import createPDF from "../utils/createPDF";

import vendedoresJson from "../assets/json/options/statesOptions";

import opcoesPedidos from "../assets/json/table_options/opcoesPedidos.json";
import opcoesItensPedido from "../assets/json/table_options/opcoesItensPedido.json";
import opcoesCotacao from "../assets/json/table_options/opcoesCotacao.json";

import "../styles/pedidos.css";

const Orders = () => {
  // Token
  const token = localStorage.getItem("token");

  // User role
  const userRoleId = localStorage.getItem("ID_FUNCAO_USUARIO");

  // Input states
  const [orderNumber, setOrderNumber] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [client, setClient] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [seller, setSeller] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // Popups
  const [isItemsPopupOpen, setIsItemsPopupOpen] = useState(false);
  const [isQuotePopupOpen, setIsQuotePopupOpen] = useState(false);

  const handleSearch = async () => {
    searchOrders([]);
    setIsLoading(true);
    const filters = {
      token: token,
      numPedido: orderNumber,
      dataInicial: dateRange[0],
      dataFinal: dateRange[1] || dateRange[0],
      cliente: client,
      cnpj: cnpj,
      vendedor: seller,
    };
    console.log(filters);

    const response = await searchOrders(filters);
    setIsLoading(false);

    if (response.success) {
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No orders found with the selected filters.",
          type: "aviso",
        });
      }
      setOrders(response.data);
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Error while searching orders.",
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
    const savedOpcoes = localStorage.getItem("opcoesPedidos");
    return atualizaOpcoes(opcoesPedidos, savedOpcoes);
  });

  const handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
    );
    setOpcoes(updatedOptions);
    localStorage.setItem("opcoesPedidos", JSON.stringify(updatedOptions));
  };

  // Popup
  const openOrderPopup = async (item) => {
    setSelectedOrder(item);
    const response = await getOrderItems(item.NUM_PEDIDO);
    if (response.success && response.data.length > 0) {
      setOrderItems(response.data);
      const heaviestItem = response.data.reduce((max, item) =>
        item.PESO_BRUTO > max.PESO_BRUTO ? item : max,
      );
      setSelectedRow(heaviestItem);
    } else if (response.success) {
      setOrderItems(response.data);
      setSelectedRow(null);
      setToastInfo({
        key: Date.now(),
        message: "No items found for this order.",
        type: "aviso",
      });
    } else {
      setOrderItems([]);
      setSelectedRow(null);
      setToastInfo({
        key: Date.now(),
        message: "Error while searching order items.",
        type: "falha",
      });
    }
    setIsItemsPopupOpen(true);
  };

  const [selectedRow, setSelectedRow] = useState(null);

  // Quote
  const [quote, setQuote] = useState(null);

  const handleQuote = async () => {
    if (!selectedRow) return;
    setIsQuotePopupOpen(true);
    setQuote(null);
    setIsQuoteLoading(true);

    const response = await calculateQuote(
      orderItems,
      selectedRow,
      selectedOrder,
    );

    if (response.success) {
      setQuote(response.data);
    } else {
      setQuote([]);
      setToastInfo({
        key: Date.now(),
        message: "Error while searching order items.",
        type: "falha",
      });
    }
    setIsQuoteLoading(false);
  };

  // Cubic volume
  const handleVolume = () => {
    if (orderItems.length === 0) return;
    const volume = calculateVolume(orderItems);
    createPDF(orderItems, volume, selectedOrder.NUM_PEDIDO);
  };

  return (
    <>
      <NavBar />
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
      <div className="main-container">
        <SideBar onSearch={handleSearch}>
          <InputLabel
            label="Order No."
            value={orderNumber}
            onChange={setOrderNumber}
            onKeyDown={handleKeyDown}
          />
          <InputDataLabel
            label="Date"
            value={dateRange}
            onChange={setDateRange}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Client"
            value={client}
            onChange={setClient}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="CNPJ"
            value={cnpj}
            onChange={setCnpj}
            onKeyDown={handleKeyDown}
          />
          {userRoleId != 2 && (
            <Select
              options={vendedoresJson}
              label="Seller"
              value={seller}
              onChange={setSeller}
              onKeyDown={handleKeyDown}
            />
          )}
        </SideBar>
        <Content titulo="Orders">
          <Tabela
            dados={orders}
            semDados="No orders found"
            hover
            loading={isLoading}
            search={opcoes.find((opcao) => opcao.id === "search").checked}
          ></Tabela>
        </Content>
      </div>
    </>
  );
};

export default Orders;
