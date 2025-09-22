import BarraLateral from "../components/BarraLateral";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

import { useState, useCallback, useEffect } from "react";

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");
  return (
    <div className="flex">
      <BarraLateral>
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
