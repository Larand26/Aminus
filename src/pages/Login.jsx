import logo from "../assets/img/png/imagologo_png.png";

import "../styles/login-page.css";
import "../styles/login-page.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="form">
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>
        <div className="input-container">
          <div>
            <label htmlFor="username">Usuário</label>
            <br />
            <input type="text" id="username" placeholder="Usuário" />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <br />
            <input type="password" id="password" placeholder="Senha" />
          </div>
        </div>
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
