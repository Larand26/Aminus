import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

const Produtos = () => {
  const search = () => {
    const produto = {
      referencia: document.getElementById("inputReferencia").value || null,
      codigoInterno:
        document.getElementById("inputCodigoInterno").value || null,
      nome: document.getElementById("inputNome").value || null,
      codigoBarras: document.getElementById("inputCodigoBarras").value || null,
    };

    window.electronApi?.searchProduto(produto);
  };

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputReferencia" />
          <label htmlFor="inputReferencia">Referência</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCodigoInterno" />
          <label htmlFor="inputCodigoInterno">Código Interno</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputNome" />
          <label htmlFor="inputNome">Nome</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCodigoBarras" />
          <label htmlFor="inputCodigoBarras">Código de Barras</label>
        </FloatLabel>
      </BarraLateral>
    </div>
  );
};

export default Produtos;
