import "../styles/barra-lateral.css";

const BarraLateral = (props) => {
  return <div className="barra-lateral">{props.children}</div>;
};

export default BarraLateral;
