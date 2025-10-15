import "../styles/input-radio.css";

const InputRadio = (props) => {
  return (
    <div
      className={`input-radio ${props.checked ? "checked-input-radio" : ""}`}
    >
      <input type="radio" checked={props.checked} onChange={props.onChange} />
    </div>
  );
};

export default InputRadio;
