import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Reserva = () => {
  const [reservas, setReservas] = useState([]);
  const search = () => {
    const reserva = {
      referencia: document.getElementById("inputReferencia").value || null,
      codigoInterno:
        document.getElementById("inputCodigoInterno").value || null,
      nome: document.getElementById("inputNome").value || null,
      numeroPedido: document.getElementById("inputNumeroPedido").value || null,
    };

    window.electronApi?.searchReserva(reserva);
    window.electronApi?.onSearchReservaResponse((reservas) => {
      setReservas(reservas);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputReferencia").value = "";
      document.getElementById("inputCodigoInterno").value = "";
      document.getElementById("inputNome").value = "";
      document.getElementById("inputNumeroPedido").value = "";
    });
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
          <InputText id="inputNumeroPedido" />
          <label htmlFor="inputNumeroPedido">Número do Pedido</label>
        </FloatLabel>
      </BarraLateral>
      <Content>
        <DataTable
          value={reservas}
          className="w-full"
          emptyMessage="Nenhuma reserva encontrada."
        >
          <Column field="codigoInterno" header="Código Interno" />
          <Column field="referencia" header="Referência" />
          <Column field="numeroPedido" header="Número do Pedido" />
          <Column field="nome" header="Nome" />
          <Column field="vendedor" header="Vendedor" />
          <Column field="quantidade" header="Quantidade" />
          <Column field="dataReserva" header="Data da Reserva" />
        </DataTable>
      </Content>
    </div>
  );
};

export default Reserva;
