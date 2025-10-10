import React, { use } from "react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import logo from "../assets/img/png/imagologo_png.png";

import "../styles/login-page.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    console.log(username, password);
  };

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
