import "../styles/configuracoes.css";

const Configuracoes = (props) => {
  return (
    <div className="configuracoes-container" id="configuracoes">
      <h1>Configurações</h1>
      <div className="opcoes-container">{props.children}</div>
    </div>
  );
};

export default Configuracoes;
