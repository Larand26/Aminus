import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

const Reserva = () => {
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
          <InputText id="inputNumeroPedido" />
          <label htmlFor="inputNumeroPedido">Número do Pedido</label>
        </FloatLabel>
      </BarraLateral>
    </div>
  );
};

export default Reserva;
