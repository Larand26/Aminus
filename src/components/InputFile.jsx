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

  const removeFile = (fileIndex) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  return (
    <div className="container-input-file">
      <input type="file" onChange={handleFileChange} multiple />
      <div className="fotos-input">
        {files.map((file, index) => (
          <div key={index} className="foto-input">
            <button className="remove-file" onClick={() => removeFile(index)}>
              <i className="fas fa-trash"></i>
            </button>
            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default InputFile;
