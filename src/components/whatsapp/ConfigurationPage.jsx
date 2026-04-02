import { Component } from "react";

//styles
import "../../styles/pages/configurationpage.css";

class ConfigurationPage extends Component {
  render() {
    return (
      <>
        <div className="wpp-config-container">
          <section>
            <p className="off">Status Atual</p>
            <h2>Resumo da Sessão</h2>
            <div>
              <div className="responses">
                <div className="response">
                  <p className="off">Aberto</p>
                  <span>{"Não"}</span>
                </div>
                <div className="response">
                  <p className="off">Conectado</p>
                  <span>{"Não"}</span>
                </div>
              </div>

              <div className="hint">
                Quando a sessão estiver <strong>aberta</strong>, o serviço já
                foi iniciado. Quando estiver <strong>conectada</strong>, o
                pareamento com o celular foi concluído.
              </div>
              <div className="flow">
                <p className="off">Fluxo</p>
                <ul>
                  <li>
                    Se a sessão estiver <strong>fechada</strong> clique em
                    iniciar sessão
                  </li>
                  <li>
                    Se a sessão estiver <strong>desconectada</strong> clique em
                    gerar Qr code
                  </li>
                  <li>
                    Use <strong>deslogar</strong> quando precisar limpar a
                    sessão
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section></section>
        </div>
      </>
    );
  }
}

export default ConfigurationPage;
