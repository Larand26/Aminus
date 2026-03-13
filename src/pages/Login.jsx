import { Component } from "react";

import logo from "../assets/img/png/imagologo.png";

import "../styles/page_styles/login.css";

import LoginUtil from "../utils/Login";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  async handleLogin() {
    const { username, password } = this.state;
    const result = await LoginUtil.login({ username, password });
    console.log(result);
  }

  render() {
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
              <input
                type="text"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                id="username"
                placeholder="Usuário"
              />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <br />
              <input
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                id="password"
                placeholder="Senha"
              />
            </div>
          </div>
          <div className="button-container">
            <button type="button" onClick={() => this.handleLogin()}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
