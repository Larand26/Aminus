import { Component } from "react";

// Components
// buttons
import Button from "../buttons/Button";

// styles
import "../../styles/pages/configurationpage.css";

class ConfigurationPage extends Component {
  render() {
    const { session } = this.props;
    const { sessionActions } = this.props;
    const { qrCode } = this.props;
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
                  <span>{session?.isOpen ? "Sim" : "Não"}</span>
                </div>
                <div className="response">
                  <p className="off">Conectado</p>
                  <span>{session?.isConnected ? "Sim" : "Não"}</span>
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
          <section>
            <p className="off">Pareamento</p>
            <h2>Qr Code</h2>
            <div>
              <div
                className="qr-code"
                style={!qrCode ? { padding: "20px" } : null}
              >
                {qrCode ? (
                  <img src={qrCode} alt="QR Code para pareamento" />
                ) : (
                  <>
                    <i className="fa-solid fa-mobile-screen-button"></i>
                    <p>Aguardando QR Code</p>
                    <p className="off">
                      Gere o QR para o usuário escanear e finalizar o login.
                    </p>
                  </>
                )}
              </div>
              <div className="buttons-container">
                <Button
                  label="Iniciar Sessão"
                  className="btn-init-session"
                  text="Iniciar Sessão"
                  icon="fa-solid fa-power-off"
                  onClick={() => sessionActions.startSession()}
                />
                <Button
                  label="Gerar QR Code"
                  className="btn-generate-qr"
                  icon="fa-solid fa-qrcode"
                  text="Gerar QR Code"
                  onClick={() => sessionActions.generateQRCode()}
                />
                <Button
                  label="Deslogar"
                  className="btn-logout"
                  text="Deslogar"
                  icon="fa-solid fa-right-from-bracket"
                  onClick={() => sessionActions.logout()}
                />
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default ConfigurationPage;
