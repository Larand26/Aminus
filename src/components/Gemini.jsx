import InputButton from "../components/InputButton";

import "../styles/gemini.css";

const Gemini = () => {
  return (
    <div className="gemini-container" id="gemini">
      <div className="respostas">
        <div className="mensagem-gemini">
          <p>Olá! Como posso ajudar você hoje?</p>
        </div>
        <div className="mensagem-usuario">
          <p>Me faz o texto de Lorem</p>
        </div>
        <div className="mensagem-gemini">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae,
            eligendi. Quaerat pariatur tempore eos incidunt quis delectus
            voluptas, excepturi iusto, ducimus architecto totam omnis corporis
            suscipit nam, quae consequuntur inventore.
          </p>
        </div>
      </div>
      <div className="input-container-gemini ">
        <InputButton
          placeholder="Digite sua mensagem..."
          icon="fa fa-paper-plane"
        />
      </div>
    </div>
  );
};
export default Gemini;
