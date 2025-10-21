import { useState, useRef } from "react";

import "../styles/input-file.css";

const InputFile = (props) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

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

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container-input-file">
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <div className="fotos-input" onClick={openFileDialog}>
        {files.map((file, index) => (
          <div
            key={index}
            className="foto-input"
            onClick={(e) => e.stopPropagation()}
          >
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
