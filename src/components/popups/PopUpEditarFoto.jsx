import InputFile from "../InputFile";

const PopUpEditarFoto = (props) => {
  return (
    <div className="pop-up-editar">
      <h2>Editar Foto</h2>
      <p>
        {props.foto?.referencia} - {props.foto?.codigo_cor}
      </p>
      <InputFile />
    </div>
  );
};
export default PopUpEditarFoto;
