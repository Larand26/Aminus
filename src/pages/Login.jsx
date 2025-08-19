import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    window.electronApi?.login(user, password);
    window.electronApi?.onLoginResponse((response) => {
      if (response.success) {
        navigate("/home");
      } else {
        // Tratar erro de login
        console.error("Erro de login:", response.error);
      }
    });
  };

  return (
    <div className="home w-full h-screen flex align-items-center justify-content-center">
      <div className="p-6 flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-30rem h-6 max-h-20rem ">
        <div className="w-10 flex flex-column align-items-center justify-content-around gap-5">
          <FloatLabel>
            <InputText
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
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
