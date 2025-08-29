import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import usuarios from "../assets/json/usuários.json";

const Login = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [password, setPassword] = useState(
    localStorage.getItem("userPassword") || ""
  );
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleLogin = () => {
    window.electronApi?.login(user, password);
    window.electronApi?.onLoginResponse((response) => {
      if (response.success) {
        localStorage.setItem("user", response.data.NOME);
        localStorage.setItem("userId", response.data.ID_USUARIO);
        localStorage.setItem("userPassword", response.data.SENHA);
        localStorage.setItem("userFuncao", response.data.ID_FUNCAO_USUARIO);
        navigate("/home");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro de login",
          detail: "Senha incorreta",
          life: 3000,
        });
        console.error("Erro de login:", response.error);
      }
    });
  };

  return (
    <div className="home w-full h-screen flex align-items-center justify-content-center">
      <Toast ref={toast} />
      <div className="p-6 flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-30rem h-6 max-h-20rem ">
        <div className="w-10 flex flex-column align-items-center justify-content-around gap-5">
          <FloatLabel>
            <Dropdown
              id="user"
              value={user}
              style={{ width: "200px" }}
              options={usuarios}
              onChange={(e) => setUser(e.value)}
              placeholder="Selecione um usuário"
            />
            <label htmlFor="user">Usuário</label>
          </FloatLabel>
          <FloatLabel>
            <Password
              id="password"
              feedback={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Senha</label>
          </FloatLabel>
          <Button label="Entrar" onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
