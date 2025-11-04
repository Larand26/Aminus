import "../styles/botao-tipo-gen.css";

const BotaoTipoGen = (props) => {
  return (
    <button onClick={props.onClick} className="botao-tipo-gen">
      <i className={props.icon}></i>
    </button>
  );
};

export default BotaoTipoGen;
