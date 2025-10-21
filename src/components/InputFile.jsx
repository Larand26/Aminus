import { useState, useRef } from "react";
import "../styles/input-file.css";

const InputFile = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  // Função para remover uma imagem
  const handleRemoveFile = (indexToRemove, e) => {
    e.stopPropagation(); // Impede que o seletor de arquivos abra
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Função para mover a imagem para a esquerda
  const handleMoveLeft = (index, e) => {
    e.stopPropagation();
    if (index === 0) return; // Não pode mover mais para a esquerda
    const newFiles = [...files];
    // Troca o elemento atual com o anterior
    [newFiles[index - 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index - 1],
    ];
    setFiles(newFiles);
  };

  // Função para mover a imagem para a direita
  const handleMoveRight = (index, e) => {
    e.stopPropagation();
    if (index === files.length - 1) return; // Não pode mover mais para a direita
    const newFiles = [...files];
    // Troca o elemento atual com o próximo
    [newFiles[index + 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index + 1],
    ];
    setFiles(newFiles);
  };

  return (
    <div className="input-file-container" onClick={handleContainerClick}>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      {files.map((file, index) => (
        <div key={index} className="image-preview-wrapper">
          <img
            src={URL.createObjectURL(file)}
            alt={`foto-${index}`}
            className="image-preview"
          />
          <div className="image-overlay">
            <button
              className="overlay-btn remove-btn"
              onClick={(e) => handleRemoveFile(index, e)}
            >
              &times;
            </button>
            <div className="move-buttons">
              <button
                className="overlay-btn move-btn"
                onClick={(e) => handleMoveLeft(index, e)}
                disabled={index === 0}
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              <button
                className="overlay-btn move-btn"
                onClick={(e) => handleMoveRight(index, e)}
                disabled={index === files.length - 1}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InputFile;
