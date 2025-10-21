import InputFile from "../InputFile";

const PopUpEditarFoto = (props) => {
  return (
    <div className="pop-up-editar">
      <h2>Editar Foto</h2>
      <InputFile onFilesChange={(files) => console.log(files)} />
      
    </div>
  );
};
export default PopUpEditarFoto;
