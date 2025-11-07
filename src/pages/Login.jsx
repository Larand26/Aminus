import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Toast from "../components/Toast";

import logo from "../assets/img/png/imagologo_png.png";

import "../styles/login-page.css";

const Login = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
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
        localStorage.setItem("userData", JSON.stringify(response.data));
        localStorage.setItem("username", response.data.NOME);
        localStorage.setItem("password", response.data.SENHA);
        localStorage.setItem(
          "ID_FUNCAO_USUARIO",
          response.data.ID_FUNCAO_USUARIO
        );
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
