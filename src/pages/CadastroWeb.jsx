import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";

const CadastroWeb = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [referencia, setReferencia] = useState("");

  const search = () => {
    setCarregando(true);
    window.electronApi?.searchCadastroProdutos(referencia);
    window.electronApi?.onSearchCadastroProdutosResponse((produtos) => {
      setProdutos(produtos);
      setCarregando(false);
    });
  };

  return (
    <div>
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="inputNome"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <label htmlFor="inputNome">Referência</label>
        </FloatLabel>
      </BarraLateral>
      <div></div>
    </div>
  );
};

export default CadastroWeb;
