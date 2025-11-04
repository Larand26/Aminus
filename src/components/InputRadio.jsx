import "../styles/inputs/input-radio.css";

const InputRadio = (props) => {
  return (
    <div
      className={`input-radio ${props.checked ? "checked-input-radio" : ""}`}
      onClick={props.onChange}
    >
      <input type="radio" checked={props.checked} readOnly />
    </div>
  );
};

export default InputRadio;
