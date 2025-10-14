import "../styles/opcao.css";

const Opcao = ({ id, label, checked, onChange }) => {
  return (
    <div className="opcao">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Opcao;
