import { useState } from "react";

import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
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

import searchPedidos from "../utils/search/searchPedidos";
import atualizaOpcoes from "../utils/atualizaOpcoes";
import getItensPedido from "../utils/getItensPedido";
import fazCotacao from "../utils/fazCotacao";
import fazCubagem from "../utils/fazCubagem";
import createPDF from "../utils/createPDF";

import vendedoresJson from "../assets/json/vendedores.json";

import opcoesPedidos from "../assets/json/opcoes/opcoesPedidos.json";
import opcoesItensPedido from "../assets/json/opcoes/opcoesItensPedido.json";
import opcoesCotacao from "../assets/json/opcoes/opcoesCotacao.json";

import "../styles/pedidos.css";

const Pedidos = () => {
  // Token
  const token = localStorage.getItem("token");

  // Função do usuário
  const idFuncao = localStorage.getItem("ID_FUNCAO_USUARIO");

  // Estados dos inputs
  const [numPedido, setNumPedido] = useState("");
  const [data, setData] = useState([null, null]);
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [vendedor, setVendedor] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isCotacaoLoading, setIsCotacaoLoading] = useState(false);

  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);

  // PopUps
  const [popUpItensOpen, setPopUpItensOpen] = useState(false);
  const [popUpCotacaoOpen, setPopUpCotacaoOpen] = useState(false);

  const handleSearch = async () => {
    searchPedidos([]);
    setIsLoading(true);
    const filters = {
      token: token,
      numPedido: numPedido,
      dataInicial: data[0],
      dataFinal: data[1] || data[0],
      cliente: cliente,
      cnpj: cnpj,
      vendedor: vendedor,
    };
    console.log(filters);

    const response = await searchPedidos(filters);
    setIsLoading(false);

    if (response.success) {
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "Nenhum pedido encontrado com os filtros informados.",
          type: "aviso",
        });
      }
      setPedidos(response.data);
    } else {
      setToastInfo({
        key: Date.now(),
        message: "Erro ao buscar pedidos.",
        type: "falha",
      });
    }
  };

  // Função para lidar com a tecla Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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

  // Popup
  const openPopupPedido = async (item) => {
    setPedidoSelecionado(item);
    const response = await getItensPedido(item.NUM_PEDIDO);
    if (response.success && response.data.length > 0) {
      setItensPedido(response.data);
      const itemMaisPesado = response.data.reduce((max, item) =>
        item.PESO_BRUTO > max.PESO_BRUTO ? item : max
      );
      setLinhaSelecionada(itemMaisPesado);
    } else if (response.success) {
      setItensPedido(response.data);
      setLinhaSelecionada(null);
      setToastInfo({
        key: Date.now(),
        message: "Nenhum item encontrado para este pedido.",
        type: "aviso",
      });
    } else {
      setItensPedido([]);
      setLinhaSelecionada(null);
      setToastInfo({
        key: Date.now(),
        message: "Erro ao pesquisar itens do pedido.",
        type: "falha",
      });
    }
    setPopUpItensOpen(true);
  };

  const [linhaSelecionada, setLinhaSelecionada] = useState(null);

  // Cotação
  const [cotacao, setCotacao] = useState(null);

  const handleCotacao = async () => {
    if (!linhaSelecionada) return;
    setPopUpCotacaoOpen(true);
    setCotacao(null);
    setIsCotacaoLoading(true);

    const response = await fazCotacao(
      itensPedido,
      linhaSelecionada,
      pedidoSelecionado
    );

    if (response.success) {
      setCotacao(response.data);
    } else {
      setCotacao([]);
      setToastInfo({
        key: Date.now(),
        message: "Erro ao pesquisar itens do pedido.",
        type: "falha",
      });
    }
    setIsCotacaoLoading(false);
  };

  // Cubagem
  const handleCubagem = () => {
    if (itensPedido.length === 0) return;
    const cubagem = fazCubagem(itensPedido);
    createPDF(itensPedido, cubagem, pedidoSelecionado.NUM_PEDIDO);
  };

  return (
    <>
      <PopUp
        id="popup-pedido"
        width="1200px"
        height="600px"
        title="Itens do Pedido"
        open={popUpItensOpen}
        setOpen={setPopUpItensOpen}
      >
        {pedidoSelecionado && (
          <div className="popup-pedido-content">
            <h1>{pedidoSelecionado.NUM_PEDIDO}</h1>
            <Tabela
              dados={itensPedido}
              semDados="Nenhum item encontrado"
              linhaSelecionada={linhaSelecionada}
              onLinhaSelecionadaChange={setLinhaSelecionada}
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
              <Button text="Cubagem" icon="fa fa-box" onClick={handleCubagem} />
              <Button
                text="Cotação"
                icon="fa fa-truck"
                onClick={handleCotacao}
              />
              <Button text="Imprimir" icon="fa fa-print" />
            </div>
          </div>
        )}
      </PopUp>
      <PopUp
        id="popup-cotacao"
        title="Cotação"
        width="600px"
        open={popUpCotacaoOpen}
        setOpen={setPopUpCotacaoOpen}
      >
        <div className="popup-cotacao-content" style={{ paddingTop: "45px" }}>
          <Tabela
            dados={cotacao}
            semDados="Nenhuma cotação encontrada"
            linhaSelecionada={linhaSelecionada}
            onLinhaSelecionadaChange={setLinhaSelecionada}
            loading={isCotacaoLoading}
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
        <BarraLateral onSearch={handleSearch}>
          <InputLabel
            label="Num Pedido"
            value={numPedido}
            onChange={setNumPedido}
            onKeyDown={handleKeyDown}
          />
          <InputDataLabel
            label="Data"
            value={data}
            onChange={setData}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Cliente"
            value={cliente}
            onChange={setCliente}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="CNPJ"
            value={cnpj}
            onChange={setCnpj}
            onKeyDown={handleKeyDown}
          />
          {idFuncao != 2 && (
            <SelectLabel
              options={vendedoresJson}
              label="Vendedor"
              value={vendedor}
              onChange={setVendedor}
              onKeyDown={handleKeyDown}
            />
          )}
        </BarraLateral>
        <Content titulo="Pedidos">
          <Tabela
            dados={pedidos}
            semDados="Nenhum pedido encontrado"
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
                  onClick={opcao.id === "NUM_PEDIDO" ? openPopupPedido : null}
                />
              ))}
          </Tabela>
        </Content>
      </div>
    </>
  );
};

export default Pedidos;
