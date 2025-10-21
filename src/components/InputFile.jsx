import { useState } from "react";

import "../styles/input-file.css";

const InputFile = (props) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));

    if (props.onFileChange) {
      props.onFileChange(event);
    }
  };

  return (
    <div className="container-input-file">
      <input type="file" onChange={handleFileChange} multiple />
      <div className="fotos-input">
        {files.map((file, index) => (
          <div key={index} className="foto-input">
            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default InputFile;
