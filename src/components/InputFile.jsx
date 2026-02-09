import { useState, useRef, useEffect } from "react";

import "../styles/inputs/input-file.css";

const InputFile = (props) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(false);
  const isFirstRender = useRef(true);

  // Sincroniza o estado interno com as props quando elas mudam (apenas na primeira renderização)
  useEffect(() => {
    if (isFirstRender.current) {
      let initial = [];
      const initialFiles = props.initialFiles;

      // Garante que estamos trabalhando com um array
      if (initialFiles) {
        if (Array.isArray(initialFiles)) {
          // Se já for um array, apenas filtra os valores nulos
          initial = initialFiles.filter((file) => file);
        } else if (typeof initialFiles === "object") {
          // Se for um objeto, converte seus valores para um array
          initial = Object.values(initialFiles).filter((file) => file);
        }
      }

      setFiles(initial);
      isFirstRender.current = false;
    }
  }, [props.initialFiles]);

  // Chama o onChange sempre que o estado 'files' mudar
  useEffect(() => {
    if (props.onChange) {
      props.onChange(files);
    }
  }, [files]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Resolve com apenas a parte Base64 da string
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);

    // Converte todos os novos arquivos para Base64
    try {
      const base64Promises = newFiles.map(fileToBase64);
      const newBase64Files = await Promise.all(base64Promises);

      setFiles((prevFiles) => [...prevFiles, ...newBase64Files]);

      if (props.onFileChange) {
        props.onFileChange(event);
      }
    } catch (error) {
      console.error("Erro ao converter arquivos para Base64:", error);
    }
  };

  const removeFile = (fileIndex) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex),
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
            {/* Esta lógica já trata strings (base64) e objetos File corretamente */}
            <img
              src={
                typeof file === "string"
                  ? `data:image/jpeg;base64,${file}`
                  : URL.createObjectURL(file)
              }
              alt={`Preview ${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default InputFile;
