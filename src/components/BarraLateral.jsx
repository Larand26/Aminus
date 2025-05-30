import logoDanielBranco from "../assets/img/svg/logo-daniel-branco.svg";
import { Button } from "primereact/button";
const BarraLateral = ({ children }) => {
  return (
    <div className="flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-13rem h-screen p-4 bg-primary pt-6 pb-6">
      <div style={{ height: "10%" }}>
        <img src={logoDanielBranco} alt="Logo Daniel Branco" />
      </div>
      <div style={{ height: "90%" }}>{children}</div>
      <div style={{ height: "10%" }}>
        <Button
          icon="pi pi-search"
          rounded
          severity="prymary"
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default BarraLateral;
