import "../styles/gemini.css";

const Gemini = () => {
  return (
    <div className="gemini-container" id="gemini">
      <div className="respostas"></div>
      <div className="input-container-gemini ">
        <input
          type="text"
          className="gemini-input"
          placeholder="Digite sua pergunta"
        />
      </div>
    </div>
  );
};
export default Gemini;
