import { useState } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/SideBar";
import Tabela from "../components/tabela/Tabela";
import Coluna from "../components/tabela/Coluna";
import SelectLabel from "../components/SelectLabel";
import InputLabel from "../components/InputLabel";
import InputDataLabel from "../components/InputDataLabel";
import Configuracoes from "../components/Configuracoes";
import Opcao from "../components/Opcao";
import Button from "../components/Button";
import Toast from "../components/Toast";
import Content from "../components/Content";

import PopUp from "../components/PopUp";

import searchOrders from "../utils/search/searchPedidos";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import getOrderItems from "../utils/getItensPedido";
import calculateQuote from "../utils/fazCotacao";
import calculateVolume from "../utils/fazCubagem";
import createPDF from "../utils/createPDF";

import vendedoresJson from "../assets/json/vendedores.json";

import opcoesPedidos from "../assets/json/opcoes/opcoesPedidos.json";
import opcoesItensPedido from "../assets/json/opcoes/opcoesItensPedido.json";
import opcoesCotacao from "../assets/json/opcoes/opcoesCotacao.json";

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
      <PopUp
        id="popup-pedido"
        width="1200px"
        height="600px"
        title="Order Items"
        open={isItemsPopupOpen}
        setOpen={setIsItemsPopupOpen}
      >
        {selectedOrder && (
          <div className="popup-pedido-content">
            <h1>{selectedOrder.NUM_PEDIDO}</h1>
            <Tabela
              dados={orderItems}
              semDados="No items found"
              linhaSelecionada={selectedRow}
              onLinhaSelecionadaChange={setSelectedRow}
            >
              {opcoesItensPedido
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
            <div className="buttons-container">
              <Button text="Volume" icon="fa fa-box" onClick={handleVolume} />
              <Button text="Quote" icon="fa fa-truck" onClick={handleQuote} />
              <Button text="Print" icon="fa fa-print" />
            </div>
          </div>
        )}
      </PopUp>
      <PopUp
        id="popup-cotacao"
        title="Quote"
        width="600px"
        open={isQuotePopupOpen}
        setOpen={setIsQuotePopupOpen}
      >
        <div className="popup-cotacao-content" style={{ paddingTop: "45px" }}>
          <Tabela
            dados={quote}
            semDados="No quotes found"
            linhaSelecionada={selectedRow}
            onLinhaSelecionadaChange={setSelectedRow}
            loading={isQuoteLoading}
          >
            {opcoesCotacao
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
            <SelectLabel
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
                  onClick={opcao.id === "NUM_PEDIDO" ? openOrderPopup : null}
                />
              ))}
          </Tabela>
        </Content>
      </div>
    </>
  );
};

export default Orders;
