import { useState, useEffect } from "react";

import InputButton from "../components/InputButton";
import Toast from "../components/Toast";

import pegaRespostaGemini from "../utils/pegaRespostaGemini";

import "../styles/gemini.css";

const Gemini = () => {
  const [pergunta, setPergunta] = useState("");
  const [respostas, setRespostas] = useState([]);

  const [toastInfo, setToastInfo] = useState(null);

  const handleEnviarPergunta = async () => {
    if (pergunta.trim() === "") return;

    setRespostas([...respostas, { conteudo: pergunta, user: "usuário" }]);
    setPergunta("");

    const resposta = await pegaRespostaGemini(pergunta);

    if (!resposta.success) {
      setToastInfo({
        tipo: "erro",
        mensagem: resposta.mensagem || "Erro ao obter resposta do Gemini.",
      });
      return;
    }
    setRespostas((prevRespostas) => [
      ...prevRespostas,
      { conteudo: resposta.data, user: "gemini" },
    ]);

    console.log(resposta);
  };

  useEffect(() => {
    if (toastInfo) {
      const timer = setTimeout(() => {
        setToastInfo(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastInfo]);

  return (
    <div className="gemini-container" id="gemini">
      {toastInfo && (
        <Toast tipo={toastInfo.tipo} mensagem={toastInfo.mensagem} />
      )}
      <div className="respostas">
        <div className="mensagem-gemini">
          <p>Olá! Como posso ajudar você hoje?</p>
        </div>
        {respostas.map((resposta, index) => (
          <div
            key={index}
            className={`mensagem-gemini ${
              resposta.user === "usuário" ? "usuario" : "gemini"
            }`}
          >
            <p>{resposta.conteudo}</p>
          </div>
        ))}
      </div>
      <div className="input-container-gemini ">
        <InputButton
          placeholder="Digite sua mensagem..."
          icon="fa fa-paper-plane"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onClick={handleEnviarPergunta}
        />
      </div>
    </div>
  );
};
export default Gemini;
