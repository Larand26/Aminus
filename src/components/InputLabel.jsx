import "../styles/inputs/input-label.css";

const InputLabel = (props) => {
  return (
    <div className={`input-label ${props.className || ""}`}>
      <label>{props.label || "Label"}</label>
      <input
        type={props.type || "text"}
        value={props.value || ""}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={props.onKeyDown}
      />
    </div>
  );
};

export default InputLabel;
