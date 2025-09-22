import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";

import { useState, useCallback, useEffect } from "react";

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");

  // Pesquisa os produtos
  const search = () => {
    window.electronApi?.searchCadastroProdutos(referencia);
    window.electronApi?.onSearchCadastroProdutosResponse((produto) => {
      console.log(produto);
    });
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
        </table>
      </Content>
    </div>
  );
};
export default CadastroWeb;
