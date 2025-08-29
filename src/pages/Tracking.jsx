import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";

import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

import imgTnt from "../assets/img/svg/transportadora/tnt.svg";
import imgRte from "../assets/img/svg/transportadora/rodonaves.svg";

const styleCards =
  "bg-gray-100 border-round-lg p-3 h-10rem w-20rem text-center shadow-2 mx-2 font-bold";

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
  const [transportadora, setTransportadora] = useState(null);
  const [nota, setNota] = useState("");
  const [result, setResult] = useState({
    nome: "",
    eventos: [],
    status: "",
    expectativa: "",
    cnpj: "",
  });
  const toast = useRef(null);

  const search = () => {
    if (!nota || !transportadora) {
      toast.current?.show({
        severity: "error",
        summary: "Campos obrigatórios",
        detail: "Por favor, preencha todos os campos.",
        life: 3000,
      });
      return;
    }
    window.electronApi?.searchRastreamento({ nota, transportadora });
    window.electronApi?.onSearchRastreamentoResponse((data) => {
      setResult(data);
      console.log(data);
      setNota("");
      setTransportadora(null);
    });
  };

  return (
    <div className="flex">
      <Toast ref={toast} />
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="input-nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
          <label htmlFor="input-nota">Nota</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            className="md:w-12rem"
            id="input-transportadora"
            value={transportadora}
            onChange={(e) => setTransportadora(e.value)}
            options={transportadoraOptions}
            optionLabel="label"
            placeholder="Selecione a Transportadora"
            itemTemplate={itemTemplate}
          />
          <label htmlFor="input-transportadora">Transportadora</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Rastreamento"}>
        <h2>Nome: {result.nome}</h2>
        <div>
          <h3>Eventos:</h3>
          <DataTable value={result.eventos}>
            <Column
              field="data"
              header="Data"
              body={(rowData) => {
                return rowData.data instanceof Date
                  ? rowData.data.toLocaleString()
                  : rowData.data;
              }}
            />
            <Column field="descricao" header="Descrição" />
          </DataTable>
        </div>
        <div className="flex w-full justify-content-around mt-4">
          <div className={styleCards}>
            Status
            <br />
            {result.status}
          </div>
          <div className={styleCards}>
            Expectativa
            <br />
            {result.expectativa
              ? result.expectativa instanceof Date
                ? result.expectativa.toLocaleDateString()
                : result.expectativa
              : ""}
          </div>
          <div className={styleCards}>
            CNPJ
            <br />
            {result.cnpj}
          </div>
        </div>
      </Content>
    </div>
  );
};
export default Tracking;
