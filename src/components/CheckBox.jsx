import "../styles/checkbox.css";

const CheckBox = ({ id, checked, onChange }) => {
  return (
    <div className="custom-checkbox">
      <input
        type="checkbox"
        id={id || ""}
        checked={checked || false}
        onChange={onChange || (() => {})}
      />
      {/* A label é usada para criar o visual do checkbox */}
      <label htmlFor={id}></label>
    </div>
  );
};

export default CheckBox;
