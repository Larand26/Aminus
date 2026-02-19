import InputFile from "../InputFile.jsx";
import InputVideo from "../InputVideo.jsx";

import "../../styles/whatsapp/mensagensWpp.css";

const Status = (props) => {
  return (
    <div className="mensagens-wpp-container">
      <div className="mensagens-wpp-inputs">
        <InputFile
          initialFiles={props.imagensStatus}
          onChange={props.setImagensStatus}
        />
        <InputVideo
          videos={props.videosStatus}
          onChange={props.setVideosStatus}
        />
      </div>
      <div className="mensagens-wpp-content">
        <div>
          <textarea
            placeholder="Caso queira usar emogis aperte a tecla Windows + ."
            name=""
            id=""
            value={props.textoStatus}
            onChange={(e) => props.setTextoStatus(e.target.value)}
          ></textarea>
        </div>
        <div className="mensagens-wpp-timer">
          <button
            className="mensagens-wpp-enviar"
            onClick={props.onEnviar || (() => {})}
            type="button"
            style={{
              transition: "background 0.3s",
            }}
            disabled={props.enviando || false}
          >
            {props.enviando ? "Enviando..." : "Enviar Status"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Status;
