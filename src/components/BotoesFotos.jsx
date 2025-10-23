import "../styles/botoes-foto.css";

const BotoesFotos = (props) => {
  const toggleConfirmDelete = (data) => {
    const confirmaDelete = document.querySelector(
      ".confirma-delete[data='" + data + "']"
    );
    if (!confirmaDelete.classList.contains("confirma-delete-open")) {
      const allConfirmaDeletes = document.querySelectorAll(".confirma-delete");
      allConfirmaDeletes.forEach((cd) =>
        cd.classList.remove("confirma-delete-open")
      );
    }
    confirmaDelete.classList.toggle("confirma-delete-open");
  };
  const closeConfirmDelete = (data) => {
    const confirmaDelete = document.querySelector(
      ".confirma-delete[data='" + data + "']"
    );
    confirmaDelete.classList.remove("confirma-delete-open");
  };
  return (
    <>
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
          <button
            className="btn excluir"
            onClick={() => toggleConfirmDelete(props.data)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="confirma-delete" data={props.data || ""}>
        <p>Deseja mesmo deletar essa foto?</p>
        <div>
          <button className="btn confirmar" onClick={props.onConfirmDelete}>
            Sim
          </button>
          <button
            className="btn cancelar"
            onClick={() => closeConfirmDelete(props.data)}
          >
            Não
          </button>
        </div>
      </div>
    </>
  );
};

export default BotoesFotos;
