import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
const Clientes = () => {
  return (
    <div className="flex">
      <BarraLateral>
        <FloatLabel>
          <InputText id="inputNome" />
          <label htmlFor="inputNome">Nome</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputId" />
          <label htmlFor="inputId">ID</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCelular" />
          <label htmlFor="inputCelular">Celular</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputEmail" />
          <label htmlFor="inputEmail">Email</label>
        </FloatLabel>
      </BarraLateral>
    </div>
  );
};

export default Clientes;
