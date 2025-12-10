import { useState, useEffect } from "react";

const MensagemComEfeitoDigitacao = ({ texto }) => {
  const [textoExibido, setTextoExibido] = useState("");

  useEffect(() => {
    let i = 0;
    const textoCompleto = texto || ""; // Garante que o texto não seja undefined
    setTextoExibido(""); // Reseta o texto ao receber novas props

    const intervalId = setInterval(() => {
      if (i < textoCompleto.length) {
        setTextoExibido((prev) => prev + textoCompleto.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 20); // Ajuste o valor (em ms) para controlar a velocidade da digitação

    return () => clearInterval(intervalId); // Limpa o intervalo se o componente for desmontado
  }, [texto]);

  // Função para converter markdown bold para HTML
  const formatarResposta = (texto) => {
    const textoFormatado = texto.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    return { __html: textoFormatado };
  };

  return <p dangerouslySetInnerHTML={formatarResposta(textoExibido)} />;
};

export default MensagemComEfeitoDigitacao;
