import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

const Produtos = () => {
  return (
    <div className="flex">
      <BarraLateral>
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
