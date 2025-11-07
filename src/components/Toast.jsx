import "../styles/toast.css";

const Toast = (props) => {
  return (
    <div className={`toast ${props.type}`}>
      <span>{props.message}</span>
      {props.type === "sucesso" && <i className="fa fa-check"></i>}
      {props.type === "falha" && <i className="fa fa-close"></i>}
      {props.type === "aviso" && <i className="fa fa-triangle-exclamation"></i>}
    </div>
  );
};
export default Toast;
