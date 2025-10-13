import "../styles/input-label.css";

const InputLabel = (props) => {
  return (
    <div className="input-label">
      <label>{props.label || "Label"}</label>
      <input
        type={props.type || "text"}
        value={props.value || ""}
        onChange={(e) => props.onChange(e.target.value) || (() => {})}
      />
    </div>
  );
};

export default InputLabel;
