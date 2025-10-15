import "../styles/button.css";

const Button = (props) => {
  return (
    <button onClick={props.onClick} className="custom-button">
      <span>{props.text}</span>
      <i className={props.icon}></i>
    </button>
  );
};

export default Button;
