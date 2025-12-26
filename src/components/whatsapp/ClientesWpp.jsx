import Table from "../tabela/Tabela";
import Coluna from "../tabela/Coluna";

import "../../styles/clientesWpp.css";

const ClientesWpp = (props) => {
  return (
    <div className="clientesWhatsappContent">
      <div className="adicionarClienteContent">
        <div className="inputGroup">
          <label htmlFor="nomeCliente">Nome</label>
          <input id="nomeCliente" type="text" placeholder="Nome" />
        </div>
        <div className="inputGroup">
          <label htmlFor="telefoneCliente">Telefone</label>
          <input id="telefoneCliente" type="text" placeholder="5511999999999" />
        </div>
        <div className="inputGroup">
          <label htmlFor="cnpjCliente">CNPJ</label>
          <input id="cnpjCliente" type="text" placeholder="Cnpj" />
        </div>
        <div className="inputGroup">
          <label htmlFor="">&zwnj;</label>
          <button onClick={props.onClick}>Adicionar</button>
        </div>
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
