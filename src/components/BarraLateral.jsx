import { useNavigate } from "react-router-dom";
import logoDanielBranco from "../assets/img/svg/logo-daniel-branco.svg";
import { Button } from "primereact/button";
import "../styles/barra-lateral.css";
const BarraLateral = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="barra-lateral flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-13rem h-screen p-4 bg-primary pt-6 pb-6">
      <div
        style={{ height: "10%" }}
        className="cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logoDanielBranco} alt="Logo Daniel Branco" />
      </div>
      <div
        style={{ height: "90%" }}
        className="flex flex-column justify-content-center align-items-center gap-6"
      >
        {children}
      </div>
      <div style={{ height: "10%" }}>
        <Button
          icon="pi pi-search"
          rounded
          severity="prymary"
          aria-label="Search"
          onClick={() => {
            if (window.electronAPI && window.electronAPI.sendOi) {
              window.electronAPI.sendOi();
            } else {
              console.warn("API do Electron não disponível");
            }
          }}
        />
      </div>
    </div>
  );
};

export default BarraLateral;
