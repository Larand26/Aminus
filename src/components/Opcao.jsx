import "../styles/opcao.css";

const Opcao = ({ id, label, checked, onClick }) => {
  return (
    <div className="opcao">
      <input type="checkbox" id={id} checked={checked} onClick={onClick} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Opcao;
