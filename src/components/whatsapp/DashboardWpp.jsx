import Tabela from "../table/Table";

import { PieChart, Pie, Cell, Legend } from "recharts";

import "../../styles/whatsapp/dashboard-wpp.css";

const Dashboard = (props) => {
  console.log(props.dados);

  const mensagensEnviadasTotal = () => {
    return props.dados.reduce((acc, curr) => acc + curr.MENSAGENS_ENVIADAS, 0);
  };
  const mensagensEnviadasTotalMensal = () => {
    const dadosMesAtual = props.dados.filter((item) => {
      const dataEnvio = new Date(item.MENSAGENS_DATA_ENVIO);
      const agora = new Date();
      return (
        dataEnvio.getMonth() === agora.getMonth() &&
        dataEnvio.getFullYear() === agora.getFullYear()
      );
    });
    return dadosMesAtual.reduce(
      (acc, curr) => acc + curr.MENSAGENS_ENVIADAS,
      0,
    );
  };
  const contatosTotais = () => {
    const contatos = new Set(props.dados.map((item) => item.CONTATO_NUMERO));
    return contatos.size;
  };
  const saudeSistema = () => {
    const totalMensagens = mensagensEnviadasTotal();
    const totalNaoEnviadas = props.dados.reduce(
      (acc, curr) => acc + curr.MENSAGENS_NAO_ENVIADAS,
      0,
    );
    if (totalMensagens === 0) return "N/A";
    const taxaSucesso =
      ((totalMensagens - totalNaoEnviadas) / totalMensagens) * 100;
    return `${taxaSucesso.toFixed(1)}%`;
  };
  const dinheiroEconomizado = () => {
    const custoPorMensagem = 0.2;
    const mensagensEnviadas = mensagensEnviadasTotal();
    const economia = mensagensEnviadas * custoPorMensagem;
    return `R$${economia.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  };
  const ultimosStatus = () => {
    if (props.dados.length === 0) return [];
    const ultimoStatus = props.dados[0];
    const data = [
      { name: "Enviadas", value: ultimoStatus.MENSAGENS_ENVIADAS },
      { name: "Não Enviadas", value: ultimoStatus.MENSAGENS_NAO_ENVIADAS },
    ];
    return data;
  };

  return (
    <div className="dashboard-wpp-container">
      <div className="dashboard-wpp-cards-container">
        <div className="dashboard-wpp-main-cards">
          <div className="dashboard-wpp-cards-row">
            <div className="dashboard-wpp-card">
              <div className="dashboard-wpp-card-title">Contatos totais</div>
              <div className="dashboard-wpp-card-value destaque">
                {props.contatos !== undefined ? props.contatos : "N/A"}
              </div>
            </div>
            <div className="dashboard-wpp-card">
              <div className="dashboard-wpp-card-title">Mensagens enviadas</div>
              <div className="dashboard-wpp-card-value destaque">
                {mensagensEnviadasTotal().toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="dashboard-wpp-card">
              <div className="dashboard-wpp-card-title">Volume Mensal</div>
              <div className="dashboard-wpp-card-value destaque">
                {mensagensEnviadasTotalMensal().toLocaleString("pt-BR")}
              </div>
            </div>
          </div>

          <div className="dashboard-wpp-cards-row">
            <div className="dashboard-wpp-card dashboard-wpp-card-status">
              <div className="dashboard-wpp-card-title">Últimos status</div>
              <div className="dashboard-wpp-status-chart placeholder">
                <PieChart width={400} height={150}>
                  <Pie
                    data={ultimosStatus()}
                    cx="40%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell key="cell-0" fill="#658884" />
                    <Cell key="cell-1" fill="#b2473e" />
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="square"
                  />
                </PieChart>
              </div>
            </div>
            <div className="dashboard-wpp-card dashboard-wpp-card-saude">
              <div className="dashboard-wpp-card-title">Saúde do sistema</div>
              <div className="dashboard-wpp-saude-value destaque-saude">
                {saudeSistema()}
              </div>
            </div>
            <div className="dashboard-wpp-card dashboard-wpp-card-economia">
              <div className="dashboard-wpp-card-title">
                Dinheiro Economizado
              </div>
              <div className="dashboard-wpp-economia-value destaque-economia">
                {dinheiroEconomizado()}
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-wpp-card sessions-container">
          <div className="dashboard-wpp-card-title">Sessões</div>
          <div className="sessions-list placeholder">
            {props.sessoes && props.sessoes.length > 0 ? (
              props.sessoes.map((sessao) => (
                <div className="session" key={sessao.id}>
                  <p>{sessao.session}</p>
                  <div>
                    <span
                      className={`session-status ${sessao.conectado ? "conectado" : "desconectado"}`}
                    ></span>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma sessão encontrada</p>
            )}
          </div>
        </div>
      </div>
      <div className="dashboard-wpp-table-container">
        <Tabela
          semDados="Nenhum produto encontrado"
          dados={props.dados || []}
          tamMax={"120px"}
        ></Tabela>
      </div>
    </div>
  );
};

export default Dashboard;
