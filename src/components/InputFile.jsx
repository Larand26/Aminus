import { useState, useRef } from "react";

import "../styles/input-file.css";

const InputFile = (props) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(false);

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

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    setDragging(false);
    handleSort();
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _files = [...files];
    const draggedItemContent = _files.splice(dragItem.current, 1)[0];
    _files.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFiles(_files);
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
            className={`foto-input ${
              dragging && dragItem.current === index ? "dragging" : ""
            }`}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
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
