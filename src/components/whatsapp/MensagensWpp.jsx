import InputFile from "../InputFile.jsx";
import Tabela from "../table/Table";

import "../../styles/whatsapp/mensagensWpp.css";

const MensagensWpp = (props) => {
  // Calcula a porcentagem do progresso
  const progressoAtual = props.progresso?.progresso || 0;
  const progressoTotal = props.progresso?.total || 0;
  const porcentagem =
    progressoTotal > 0
      ? Math.min((progressoAtual / progressoTotal) * 100, 100)
      : 0;

  // Cor do botão baseada no progresso (do vermelho ao verde)
  const buttonColor = `linear-gradient(90deg, #df9f4ee4 ${porcentagem}%, #dfa04ea7 ${porcentagem}%)`;

  return (
    <div className="mensagens-wpp-container">
      <div>
        <InputFile initialFiles={props.imagens} onChange={props.setImagens} />
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
          <Tabela
            dados={props.dados}
            semDados="Nenhum contato encontrado"
            tamMax="400px"
            loading={props.loading}
            onEdit={props.onEdit}
            chave="CONTATO_ID"
            select="checkbox"
            onSelectionChange={props.onSelectionChange}
          ></Tabela>
          <button
            className="mensagens-wpp-enviar"
            onClick={props.onEnviar}
            type="button"
            style={{
              background: buttonColor,
              transition: "background 0.3s",
            }}
            disabled={props.enviando || !props.qrCodeConectado}
          >
            {props.qrCodeConectado
              ? props.enviando
                ? "Enviando..."
                : "Enviar Mensagem"
              : "Conecte o QR Code"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default MensagensWpp;
