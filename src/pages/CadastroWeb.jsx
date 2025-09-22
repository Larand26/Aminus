import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

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
    </div>
  );
};
export default CadastroWeb;
