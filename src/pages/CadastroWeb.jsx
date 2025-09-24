import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import "../styles/cadastro-web.css";
import "../styles/tabela-produtos-web.css";
import "../styles/icons.css";

import { useState, useCallback, useEffect, use } from "react";

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState({
    sku: "",
    numeros: [],
    quantidades: [],
    grupo: [],
  });

  const handleProdutoChange = (produto) => {
    if (!produto) return;
    setProdutoSelecionado(produto);
  };

  //cores
  const [cores, setCores] = useState([]);
  const [selectedCor, setSelectedCor] = useState([]);

  const searchCores = (cor) => {
    window.electronApi?.getCores(cor || "");
    window.electronApi?.onGetCoresResponse((novasCores) => {
      // Junta as cores atuais com as novas e remove duplicadas pelo campo 'value'
      const todasCores = [...selectedCor, ...novasCores];
      const coresUnicas = todasCores.filter(
        (cor, index, self) =>
          index === self.findIndex((c) => c.value === cor.value)
      );
      setCores(coresUnicas);
    });
  };

  const handleCorChange = (index, value) => {
    const corSelecionada = cores.find((cor) => cor.value === value);
    // troca a cor selecionada no índice específico
    setSelectedCor((prev) => {
      const updated = [...prev];
      updated[index] = corSelecionada || null;
      return updated;
    });
  };

  useEffect(() => {
    searchCores();
  }, [selectedCor]);

  useEffect(() => {
    console.log(produtos);
    setSelectedCor(
      produtos.map((produto) => ({
        value: produto.ID_CORES_ECOMERCE || null,
        label: produto.COR_DESCRICAO || "Nenhuma",
      }))
    );
    const produtoSelecionado = {
      sku: produtos[0]?.ID_CODPRODUTO || "",
      numeros: produtos[0]?.NUMEROS.split(",") || [],
      quantidades: produtos[0]?.QUANTIDADES.split(",") || [],
      grupo: produtos[0]?.GRUP_DESCRICAO.split(", ") || [],
    };
    setProdutoSelecionado(produtoSelecionado || {});
  }, [produtos]);

  //Checkboxes
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeEcommerce, setActiveEcommerce] = useState([]);

  // Atualiza o estado dos checkboxes quando os produtos mudam
  useEffect(() => {
    setSelectedProducts(Array(produtos.length).fill(false));
  }, [produtos]);

  useEffect(() => {
    setActiveEcommerce(
      produtos.map(
        (produto) =>
          produto.PRO_ATIVO_ECOMMERCE === true &&
          produto.PRO_INTEGRACAO_ECOMMERCE === true
      )
    );
  }, [produtos]);

  const handleCheckboxChange = (index) => {
    setSelectedProducts((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleActiveEcommerceChange = (index) => {
    setActiveEcommerce((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleAllCheckBoxes = () => {
    const allChecked = selectedProducts.every((val) => val === true);
    setSelectedProducts(Array(produtos.length).fill(!allChecked));
  };

  const handleAllActiveEcommerce = () => {
    const allChecked = activeEcommerce.every((val) => val === true);
    setActiveEcommerce(Array(produtos.length).fill(!allChecked));
  };

  // Pesquisa os produtos
  const search = () => {
    window.electronApi?.searchCadastroProdutos(referencia);
    // searchCores();
  };

  useEffect(() => {
    window.electronApi?.onSearchCadastroProdutosResponse((produto) => {
      setProdutos(produto);
    });
  }, []);

  //constroi tabela de produtos
  const renderTableRows = () => {
    return produtos.map((produto, index) => (
      <tr key={produto.id}>
        <td>
          <Checkbox
            onChange={() => handleCheckboxChange(index)}
            checked={!!selectedProducts[index]}
          />
        </td>
        <td>{produto.ID_CODPRODUTO}</td>
        <td>{produto.PROD_DESCRCOMPLETA}</td>
        <td>{produto.SKU_PRODUTO_PAI}</td>
        <td>
          <Dropdown
            filter
            options={cores}
            value={selectedCor[index]?.value || null}
            onChange={(e) => handleCorChange(index, e.value)}
            onFilter={(e) => searchCores(e.filter)}
          />
        </td>
        <td>
          <Checkbox
            checked={!!activeEcommerce[index]}
            onChange={() => handleActiveEcommerceChange(index)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="inputReferencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <label htmlFor="inputReferencia">Referencia</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Cadastro Web"}>
        <div>{JSON.stringify(produtoSelecionado)}</div>
        <div className="mb-3 p-2 flex gap-3">
          <div className="cont-buttons">
            <Button
              title="Feminino"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("FEMININO")}
              icon="icon-female"
              iconPos="right"
            />
            <Button
              title="Masculino"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("MASCULINO")}
              icon="icon-male"
              iconPos="right"
            />
            <Button
              title="Infantil"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("INFANTIL")}
              icon="icon-child"
              iconPos="right"
            />
            <Button
              title="Baby"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BABY")}
              icon="icon-baby"
              iconPos="right"
            />
            <Button
              title="Unisex"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("UNISEX")}
              icon="icon-unisex"
              iconPos="right"
            />
            <Button
              severity="danger"
              title="Promo"
              rounded
              outlined
              icon="icon-promo"
              iconPos="right"
            />
          </div>
          <div className="cont-buttons">
            <Button
              title="Chinelo"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("CHINELO DEDO")}
              icon="icon-chinelo"
              iconPos="right"
            />
            <Button
              title="Sandália"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SANDÁLIA")}
              icon="icon-sandalia"
              iconPos="right"
            />
            <Button
              title="Slide"
              rounded
              outlined={
                !produtoSelecionado.grupo?.includes("CHINELO GÁSPEA/SLIDE")
              }
              icon="icon-slide"
              iconPos="right"
            />
            <Button
              title="Rasteira"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("RASTEIRINHAS")}
              icon="icon-rasteira"
              iconPos="right"
            />
            <Button
              title="Tamanco"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("TAMANCO")}
              icon="icon-tamanco"
              iconPos="right"
            />
            <Button
              title="Babuche"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BABUCH")}
              icon="icon-babuche"
              iconPos="right"
            />
            <Button
              title="Bota"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BOTA")}
              icon="icon-bota"
              iconPos="right"
            />
            <Button
              title="Sapatilha"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SAPATILHA")}
              icon="icon-sapatilha"
              iconPos="right"
            />
            <Button
              title="Sapato"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SAPATO")}
              icon="icon-sapato"
              iconPos="right"
            />
            <Button
              title="Bolsa"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BOLSA")}
              icon="icon-bolsa"
              iconPos="right"
            />
          </div>
          <div className="cont-grade">
            <div className="w-full ">
              <InputText placeholder="Nome do produto" className="w-full" />
            </div>
            <div className="w-full flex">
              <InputText
                placeholder="Coloque uma cor nova..."
                className="w-full"
              />
              <Button icon="pi pi-plus" className="circle-btn" />
            </div>
            <div className="cont-tabela-grade-web">
              <table className="tabela-grade-web">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {produtoSelecionado.numeros &&
                    produtoSelecionado.numeros.map((num, idx) => (
                      <tr key={idx}>
                        <td>{num}</td>
                        <td>{produtoSelecionado.quantidades[idx]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cont-display">
            <div className="display-dados">
              <div>Nome: {produtoSelecionado.nome}</div>
              <div>Pai: {produtoSelecionado.pai}</div>
              <div></div>
            </div>
            <div className="display-imagem"></div>
          </div>
        </div>
        <div className="overflow-y-scroll h-25rem">
          <table className="tabela-produtos-web">
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={selectedProducts.every((val) => val)}
                    onChange={() => handleAllCheckBoxes()}
                  />
                </th>
                <th>SKU</th>
                <th>Descrição</th>
                <th>Pai</th>
                <th>Cor</th>
                <th>
                  <Checkbox
                    checked={activeEcommerce.every((val) => val)}
                    onChange={() => handleAllActiveEcommerce()}
                  />
                </th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </Content>
    </div>
  );
};
export default CadastroWeb;
