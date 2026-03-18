import { Component } from "react";

import NavBar from "../components/NavBar.jsx";
import SideBar from "../components/SideBar.jsx";
import InputLabel from "../components/InputLabel.jsx";
import InputNumeroLabel from "../components/InputNumeroLabel.jsx";
import Configuracoes from "../components/Configuracoes.jsx";
import Opcao from "../components/Opcao.jsx";
import Toast from "../components/Toast.jsx";
import Content from "../components/Content.jsx";
import InputText from "../components/inputs/InputText.jsx";
import Table from "../components/tabela/Table.jsx";

import ProductUtil from "../utils/Product.js";

import opcoesProdutos from "../assets/json/opcoes/opcoesProdutos.json";

import atualizaOpcoes from "../utils/atualizaOpcoes.js";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codFabricante: null,
      codInterno: null,
      codBarras: null,
      nome: null,
      quantidade: null,
      toastInfo: null,
      isLoading: false,
      produtos: [],
      selectedItems: [],
      opcoes: atualizaOpcoes(
        opcoesProdutos,
        localStorage.getItem("opcoesProdutos"),
      ),
    };
  }

  handleSearch = async () => {
    this.setState({ produtos: [], isLoading: true });
    const response = await ProductUtil.getProducts({
      token: "token",
      filters: {
        idFabric: this.state.codFabricante,
        idProduto: this.state.codInterno,
        barcode: this.state.codBarras,
        description: this.state.nome,
        quantity: this.state.quantidade,
      },
    });
    this.setState({ isLoading: false });
    console.log(response);

    if (response.success) {
      this.setState({ produtos: response.data });
      if (response.data.length === 0) {
        this.setState({
          toastInfo: {
            key: Date.now(),
            message: "No products found with the selected filters.",
            type: "aviso",
          },
        });
      }
    } else {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Error while searching products.",
          type: "falha",
        },
      });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  };

  handleOptionClick = (e) => {
    const { id } = e.target;
    const updatedOptions = this.state.opcoes.map((opcao) =>
      opcao.id === id ? { ...opcao, checked: !opcao.checked } : opcao,
    );
    this.setState({ opcoes: updatedOptions });
    localStorage.setItem("opcoesProdutos", JSON.stringify(updatedOptions));
  };

  handleSelectionChange = (items) => {
    if (Array.isArray(items)) {
      this.setState({ selectedItems: items });
    } else {
      this.setState((prevState) => ({
        selectedItems: prevState.selectedItems.includes(items)
          ? prevState.selectedItems.filter((item) => item !== items)
          : [...prevState.selectedItems, items],
      }));
    }
  };

  render() {
    const {
      codFabricante,
      codInterno,
      codBarras,
      nome,
      quantidade,
      toastInfo,
      isLoading,
      produtos,
      selectedItems,
      opcoes,
    } = this.state;

    return (
      <>
        <Configuracoes>
          {opcoes.map((opcao) => (
            <Opcao
              key={opcao.id}
              id={opcao.id}
              label={opcao.label}
              checked={opcao.checked}
              onChange={this.handleOptionClick}
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
          <SideBar onSearch={this.handleSearch}>
            <InputText
              label="Manufacturer Code"
              value={codFabricante}
              onChange={(value) => this.setState({ codFabricante: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Internal Code"
              value={codInterno}
              onChange={(value) => this.setState({ codInterno: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Barcode"
              value={codBarras}
              onChange={(value) => this.setState({ codBarras: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Name"
              value={nome}
              onChange={(value) => this.setState({ nome: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputNumeroLabel
              adicional={12}
              label="Quantity"
              value={quantidade}
              onChange={(value) => this.setState({ quantidade: value })}
              onKeyDown={this.handleKeyDown}
            />
          </SideBar>
          <Content titulo="Products">
            <Table
              options={opcoes.filter((opcao) => opcao.checked)}
              datas={produtos}
              loading={isLoading}
              selectedItems={selectedItems}
              onSelectionChange={this.handleSelectionChange}
            ></Table>
          </Content>
        </div>
      </>
    );
  }
}

export default Products;
