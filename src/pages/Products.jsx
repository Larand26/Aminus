import { Component } from "react";

import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import InputNumeroLabel from "../components/inputs/InputNumber";
import Toast from "../components/misc/Toast";
import Content from "../components/misc/Content";
import InputText from "../components/inputs/InputText";
import Table from "../components/table/Table";
import Loading from "../components/misc/Loading.jsx";

import ProductUtil from "../utils/Product.js";

import opcoesProdutos from "../assets/json/table_options/productOptions";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      codFabricante: null,
      codInterno: null,
      codBarras: null,
      nome: null,
      quantidade: null,
      toastInfo: null,
      isLoading: false,
      produtos: [],
      selectedItems: [],
    };
  }
  handleSearch = async () => {
    this.setState({ produtos: [], isLoading: true });
    const response = await ProductUtil.getProducts({
      token: this.state.token,
      filters: {
        manufacturerCode: this.state.codFabricante,
        productCode: this.state.codInterno,
        productBarcode: this.state.codBarras,
        productDescription: this.state.nome,
        productQuantity: this.state.quantidade,
      },
    });
    this.setState({ isLoading: false });

    if (response.success) {
      this.setState({ produtos: response.data });
      if (response.data.length === 0) {
        this.setState({
          toastInfo: {
            key: Date.now(),
            message: "Nenhum produto encontrado com os filtros selecionados.",
            type: "aviso",
          },
        });
      }
    } else {
      this.setState({
        toastInfo: {
          key: Date.now(),
          message: "Erro ao pesquisar produtos.",
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
              label="Código Fabricante"
              value={codFabricante}
              onChange={(value) => this.setState({ codFabricante: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Código Interno"
              value={codInterno}
              onChange={(value) => this.setState({ codInterno: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Código de Barras"
              value={codBarras}
              onChange={(value) => this.setState({ codBarras: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputText
              label="Descrição"
              value={nome}
              onChange={(value) => this.setState({ nome: value })}
              onKeyDown={this.handleKeyDown}
            />
            <InputNumeroLabel
              adicional={12}
              label="Quantidade"
              value={quantidade}
              onChange={(value) => this.setState({ quantidade: value })}
              onKeyDown={this.handleKeyDown}
            />
          </SideBar>
          <Content titulo="Produtos">
            <Table
              options={opcoes}
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
