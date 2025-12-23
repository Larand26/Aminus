import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import autenticaToken from "../utils/autenticaToken";

import Toast from "../components/Toast";

import logo from "../assets/img/png/imagologo_png.png";

import "../styles/login-page.css";

const Login = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const verificaToken = async () => {
    if (!token) return;
    const response = await autenticaToken(token);
    console.log("Resposta da autenticação do token:", response);
    if (response.success && token) {
      navigate("/home");
    }
  };
  // Roda a verificação quando carrega a página
  useEffect(() => {
    verificaToken();
  }, [token]);

  const navigate = useNavigate();

  const [toastInfo, setToastInfo] = useState(null);

  useEffect(() => {
    const handleLoginResponse = (response) => {
      if (!response.success) {
        setToastInfo({
          key: Date.now(),
          message: "Usuário ou senha inválidos.",
          type: "erro",
        });
        return;
      }
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        localStorage.setItem("username", response.data.NOME);
        localStorage.setItem("funcao", response.data.DESCRICAO_FUNCAO);
        localStorage.setItem("ID_FUNCAO_USUARIO", response.data.ID_FUNCAO);
      }
      navigate("/home");
    };
    window.electronApi?.onLoginResponse(handleLoginResponse);
  }, [navigate]);

  const login = () => {
    if (!username || !password) return;
    window.electronApi?.login(username.toUpperCase(), password);
  };

  return (
    <div className="login-page">
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
      <div className="form">
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>
        <div className="input-container">
          <div>
            <label htmlFor="username">Usuário</label>
            <br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder="Usuário"
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Senha"
            />
          </div>
        </div>
        <div className="button-container">
          <button type="button" onClick={() => login()}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
