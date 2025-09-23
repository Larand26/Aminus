import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

import "../styles/tabela-produtos-web.css";

import { useState, useCallback, useEffect, use } from "react";

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");
  const [produtos, setProdutos] = useState([]);

  //cores
  const [cores, setCores] = useState([]);
  const [selectedCor, setSelectedCor] = useState([]);

  useEffect(() => {
    setSelectedCor(
      produtos.map((produto) => produto.ID_CORES_ECOMERCE || null)
    );
  }, [produtos]);

  const searchCores = (cor) => {
    window.electronApi?.getCores(cor || "");
    window.electronApi?.onGetCoresResponse((novasCores) => {
      setCores((coresAntigas) => {
        // Junta as cores antigas com as novas, evitando duplicidade pelo value
        const todasCores = [...coresAntigas, ...novasCores];
        const unique = {};
        return todasCores.filter((cor) => {
          if (unique[cor.value]) return false;
          unique[cor.value] = true;
          return true;
        });
      });
    });
  };

  const handleCorChange = (index, value) => {
    const corSelecionada = cores.find((cor) => cor.value === value);
    setSelectedCor((prev) => {
      const updated = [...prev];
      updated[index] = corSelecionada.value || 1;
      return updated;
    });
  };

  useEffect(() => {
    const unique = {};
    const coresUnicas = produtos
      .filter((produto) => {
        if (!produto.ID_CORES_ECOMERCE || unique[produto.ID_CORES_ECOMERCE])
          return false;
        unique[produto.ID_CORES_ECOMERCE] = true;
        return true;
      })
      .map((produto) => ({
        label: produto.COR_DESCRICAO,
        value: produto.ID_CORES_ECOMERCE,
      }));
    setCores(coresUnicas);
    searchCores();
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
            value={selectedCor[index]}
            onChange={(e) => handleCorChange(index, e.value)}
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
        <p>{selectedCor.join(", ")}</p>
        <p>{cores.map((cor) => cor.label).join(", ")}</p>
        <p>{cores.length}</p>
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
