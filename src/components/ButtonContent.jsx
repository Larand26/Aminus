import "../styles/ButtonContent.css";

const ButtonContent = (props) => {
  return (
    <button className="button-content" onClick={props.onClick}>
      <i className={props.icon}></i>
    </button>
  );
};
export default ButtonContent;
