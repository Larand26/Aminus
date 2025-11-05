import "../styles/inputs/input-button.css";

const InputButton = (props) => {
  return (
    <div className="input-button-container">
      <input
        type="text"
        className="input-field"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <button className="icon-button" onClick={props.onClick}>
        <i className={props.icon}></i>
      </button>
    </div>
  );
};
export default InputButton;
