import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

import imgTnt from "../assets/img/svg/transportadora/tnt.svg";
import imgRte from "../assets/img/svg/transportadora/rodonaves.svg";

const transportadoraOptions = [
  {
    label: "TNT",
    value: "tnt",
    img: imgTnt,
  },
  {
    label: "RODONAVES",
    value: "rte",
    img: imgRte,
  },
];

const itemTemplate = (option) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={option.img}
      alt={option.label}
      style={{ width: 40, marginRight: 8 }}
    />
    <span>{option.label}</span>
  </div>
);

const Tracking = () => {
  const [selectedTransportadora, setSelectedTransportadora] = useState(null);

  return (
    <div>
      <BarraLateral>
        <FloatLabel>
          <InputText id="input-nota" />
          <label htmlFor="input-nota">Nota</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            className="md:w-12rem"
            id="input-transportadora"
            value={selectedTransportadora}
            onChange={(e) => setSelectedTransportadora(e.value)}
            options={transportadoraOptions}
            optionLabel="label"
            placeholder="Selecione a Transportadora"
            itemTemplate={itemTemplate}
          />
          <label htmlFor="input-transportadora">Transportadora</label>
        </FloatLabel>
      </BarraLateral>
    </div>
  );
};
export default Tracking;
