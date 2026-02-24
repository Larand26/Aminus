import { useRef } from "react";
import "../styles/inputs/inputVideo.css";

const InputVideo = (props) => {
  const { videos = [], onChange = () => {} } = props;
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const videoUrl = URL.createObjectURL(file);

      // Ler o arquivo como ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;

        // Cria o objeto com a estrutura desejada
        // Extraímos manualmente as propriedades do File para um objeto simples
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };

        // Cria o objeto com a estrutura desejada
        const novoVideoObj = { url: videoUrl, buffer: buffer, file: fileData };
        const novosVideos = [...videos, novoVideoObj];
        onChange(novosVideos);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div
      className="input-video"
      onClick={(e) => {
        // Evita loop infinito se o clique for originado do próprio input
        if (e.target.tagName === "INPUT") return;
        inputRef.current.click();
      }}
    >
      <input
        type="file"
        multiple={true}
        accept="video/mp4, video/quicktime, .mov"
        onChange={handleFileChange}
        onClick={(e) => {
          e.stopPropagation();
          e.target.value = null;
        }}
        ref={inputRef}
        style={{ display: "none" }}
      />
      {videos.length > 0 && (
        <>
          {videos.map((videoObj, index) => (
            <div key={index} className="video-preview">
              <video controls onClick={(e) => e.stopPropagation()}>
                <source src={videoObj.url} type="video/mp4" />
                <source src={videoObj.url} type="video/quicktime" />
                <source src={videoObj.url} type="video/x-m4v" />
                Seu navegador não suporta a tag de vídeo.
              </video>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const novosVideos = videos.filter((_, i) => i !== index);
                  onChange(novosVideos);
                }}
                className="botao-delete"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InputVideo;
