import InputFile from "../InputFile.jsx";

import "../../styles/whatsapp/mensagensWpp.css";

const MensagensWpp = (props) => {
  return (
    <div className="mensagens-wpp-container">
      <div>
        <InputFile imagens={props.imagens} setImagens={props.setImagens} />
      </div>
      <div className="mensagens-wpp-content">
        <div>
          <textarea
            placeholder="Caso queira usar emogis aperte a tecla Windows + ."
            name=""
            id=""
            value={props.mensagemEnviar}
            onChange={(e) => props.setMensagemEnviar(e.target.value)}
          ></textarea>
        </div>
        <div className="mensagens-wpp-timer">
          <div className="timer-box">
            <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
              Timer
            </div>
            <div className="timer">{props.timer}</div>
          </div>
          <button
            className="mensagens-wpp-enviar"
            onClick={props.onEnviar}
            type="button"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
export default MensagensWpp;
