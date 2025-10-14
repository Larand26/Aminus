import "../styles/opcao.css";

const Opcao = ({ id, label, ...props }) => {
  return (
    <div className="opcao">
      <input type="checkbox" id={id} {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Opcao;
