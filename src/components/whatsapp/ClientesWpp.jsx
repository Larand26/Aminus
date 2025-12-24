import Table from "../tabela/Tabela";
import Coluna from "../tabela/Coluna";

import "../../styles/clientesWpp.css";

const ClientesWpp = (props) => {
  return (
    <div className="clientesWhatsappContent">
      <div className="adicionarClienteContent">
        <input type="text" placeholder="Nome" />
        <input type="text" placeholder="Telefone" />
        <input type="text" placeholder="Email" />
        <button onClick={props.onClick}>Adicionar</button>
      </div>
      <div>
        <Table dados={props.dados} semDados="Nenhuma nota fiscal encontrada">
          {props.opcoes
            .filter((opcao) => opcao.checked)
            .map((opcao) => (
              <Coluna
                key={opcao.id}
                titulo={opcao.label}
                campo={opcao.id}
                format={opcao.format || ""}
                dados={opcao.dados || []}
                copy={opcao.copy || false}
              />
            ))}
        </Table>
      </div>
    </div>
  );
};
export default ClientesWpp;
