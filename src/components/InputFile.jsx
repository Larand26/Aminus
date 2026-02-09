import { useState, useRef, useEffect } from "react";

import "../styles/inputs/input-file.css";

const InputFile = (props) => {
  return (
    <>
      <div className="input-file-container">
        <input type="file" name="inputfile" id={props.id} />
      </div>
    </>
  );
};
export default InputFile;
