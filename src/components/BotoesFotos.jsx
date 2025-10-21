import "../styles/botoes-foto.css";

const BotoesFotos = (props) => {
  return (
    <div className="botoes-foto-container">
      <p className="cor-nome">{props.foto.nome_cor}</p>
      <p className="cor-cod">{props.foto.codigo_cor}</p>
      <div className="botoes">
        <button className="btn baixar" onClick={props.onDownloadClick}>
          <i className="fa fa-download"></i>
        </button>
        <button className="btn editar" onClick={props.onEditClick}>
          <i className="fa fa-edit"></i>
        </button>
        <button className="btn excluir" onClick={props.onDeleteClick}>
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default BotoesFotos;
