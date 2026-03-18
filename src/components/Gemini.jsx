import React, { Component } from "react";

import InputButton from "../components/InputButton";
import Toast from "../components/Toast";
import MensagemComEfeitoDigitacao from "../components/EfeitoDigitacao";

import pegaRespostaGemini from "../utils/pegaRespostaGemini";

import "../styles/gemini.css";

class Gemini extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      responses: [],
      toastInfo: null,
    };
    this.toastTimer = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { toastInfo } = this.state;

    if (toastInfo && !prevState.toastInfo) {
      this.toastTimer = setTimeout(() => {
        this.setState({ toastInfo: null });
      }, 3000);
    }

    if (!toastInfo && prevState.toastInfo && this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  componentWillUnmount() {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  handleSendQuestion = async () => {
    const { question, responses } = this.state;

    if (question.trim() === "") return;

    const newUserResponses = [
      ...responses,
      { content: question, user: "user" },
    ];
    this.setState({ responses: newUserResponses, question: "" });

    const answer = await pegaRespostaGemini(question, responses);

    if (!answer.success) {
      this.setState({
        toastInfo: {
          tipo: "erro",
          mensagem: answer.mensagem || "Error getting Gemini response.",
        },
        responses,
      });
      return;
    }

    this.setState((prevState) => ({
      responses: [
        ...prevState.responses,
        { content: answer.data, user: "gemini" },
      ],
    }));
  };

  handleInputChange = (e) => {
    this.setState({ question: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleSendQuestion();
    }
  };

  render() {
    const { question, responses, toastInfo } = this.state;

    return (
      <div className="gemini-container" id="gemini">
        {toastInfo && (
          <Toast tipo={toastInfo.tipo} mensagem={toastInfo.mensagem} />
        )}
        <div className="responses">
          <div className="gemini-message">
            <p>Hello! How can I help you today?</p>
          </div>
          {responses.map((response, index) => (
            <div
              key={index}
              className={`gemini-message ${
                response.user === "user" ? "user" : "gemini"
              }`}
            >
              {response.user === "gemini" ? (
                <MensagemComEfeitoDigitacao texto={response.content} />
              ) : (
                <p>{response.content}</p>
              )}
            </div>
          ))}
        </div>
        <div className="gemini-input-container">
          <InputButton
            placeholder="Type your message..."
            icon="fa fa-paper-plane"
            value={question}
            onChange={this.handleInputChange}
            onClick={this.handleSendQuestion}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default Gemini;
