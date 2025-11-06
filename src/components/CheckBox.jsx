import "../styles/checkbox.css";

const CheckBox = (props) => {
  return (
    <div
      className={`custom-checkbox ${props.className || ""} ${
        props.disabled ? "disabled" : ""
      }`}
    >
      <input
        type="checkbox"
        id={props.id || ""}
        checked={props.disabled ? false : props.checked || false}
        onChange={props.disabled ? () => {} : props.onChange || (() => {})}
        disabled={props.disabled || false}
      />
      {/* A label é usada para criar o visual do checkbox */}
      <label htmlFor={props.id}></label>
    </div>
  );
};

export default CheckBox;
