import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";

import { useState, useCallback, useEffect } from "react";

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");
  const [produtos, setProdutos] = useState([]);

  // Pesquisa os produtos
  const search = () => {
    window.electronApi?.searchCadastroProdutos(referencia);
  };

  useEffect(() => {
    window.electronApi?.onSearchCadastroProdutosResponse((produto) => {
      setProdutos(produto);
      console.log(produto);
    });
  }, []);

  //constroi tabela de produtos
  const renderTableRows = () => {
    return produtos.map((produto) => (
      <tr key={produto.id}>
        <td>
          <Checkbox />
        </td>
        <td>{produto.ID_CODPRODUTO}</td>
        <td>{produto.ECOMMERCE_DESCRICAO}</td>
        <td>{produto.SKU_PRODUTO_PAI}</td>
        <td>{produto.COR_DESCRICAO}</td>
        <td>
          <Checkbox />
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
        <div className="overflow-y-scroll h-25rem">
          <table>
            <thead>
              <tr>
                <th>
                  <Checkbox />
                </th>
                <th>SKU</th>
                <th>Descrição</th>
                <th>Pai</th>
                <th>Cor</th>
                <th>
                  <Checkbox />
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
