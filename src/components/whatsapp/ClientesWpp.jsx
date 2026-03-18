import { useState } from "react";

import Table from "../table/Table";

import "../../styles/clientesWpp.css";

const ClientesWpp = (props) => {
  return (
    <div className="clientesWhatsappContent">
      <div className="adicionarClienteContent">
        <div className="inputGroup">
          <label htmlFor="nomeCliente">Nome</label>
          <input
            value={props.novoCliente?.nome || ""}
            onChange={(e) =>
              props.setNovoCliente({
                ...props.novoCliente,
                nome: e.target.value,
              })
            }
            id="nomeCliente"
            type="text"
            placeholder="Nome"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="telefoneCliente">Telefone</label>
          <input
            value={props.novoCliente?.numero || ""}
            onChange={(e) =>
              props.setNovoCliente({
                ...props.novoCliente,
                numero: e.target.value.replace(/\D/g, ""), // Remove tudo que não for dígito
              })
            }
            id="telefoneCliente"
            type="text"
            inputMode="numeric"
            placeholder="5511999999999"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="cnpjCliente">CNPJ</label>
          <input
            value={props.novoCliente?.cnpj || ""}
            onChange={(e) =>
              props.setNovoCliente({
                ...props.novoCliente,
                cnpj: e.target.value,
              })
            }
            id="cnpjCliente"
            type="text"
            placeholder="Cnpj"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="">&zwnj;</label>
          <button onClick={props.onClick}>Adicionar</button>
        </div>
      </div>
      <div>
        <Table
          dados={props.dados}
          semDados="Nenhuma nota fiscal encontrada"
          tamMax="400px"
          loading={props.loading}
          onEdit={props.onEdit}
          chave="CONTATO_ID"
        ></Table>
      </div>
    </div>
  );
};
export default ClientesWpp;
