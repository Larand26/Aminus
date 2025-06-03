import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";

const Fotos = () => {
  return (
    <div className="flex">
      <BarraLateral>
        <FloatLabel>
          <InputText id="inputReferencia" />
          <label htmlFor="inputReferencia">Referência</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCodigoCor" />
          <label htmlFor="inputCodigoCor">Código da Cor</label>
        </FloatLabel>
      </BarraLateral>
      <div className="content flex flex-wrap align-items-center justify-content-around w-full min-h-screen bg-gray-200 p-4">
        <Card title="25122" subTitle="09064" className="md:w-13rem">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          </p>
        </Card>
        <Card title="25122" subTitle="09064" className="md:w-13rem">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          </p>
        </Card>
        <Card title="25122" subTitle="09064" className="md:w-13rem">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          </p>
        </Card>
      </div>
    </div>
  );
};
export default Fotos;
