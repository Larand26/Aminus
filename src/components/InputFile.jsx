import { useRef } from "react";

import "../styles/inputs/input-file.css";

const InputFile = (props) => {
  const inputRef = useRef();

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="input-file-container" onClick={handleButtonClick}>
      <input
        type="file"
        name="inputfile"
        id={props.id}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={props.onChange}
        multiple
      />
    </div>
  );
};
export default InputFile;
