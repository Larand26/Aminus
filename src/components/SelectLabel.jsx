import "../styles/select-label.css";

const SelectLabel = (props) => {
  return (
    <div className="select-label">
      <label>{props.label || "Label"}</label>
      <select>
        <option value=""></option>
        {props.options &&
          props.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
};
export default SelectLabel;
