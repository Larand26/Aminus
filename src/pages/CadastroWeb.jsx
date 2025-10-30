import NavBar from "../components/NavBar";
import BarraLateral from "../components/BarraLateral";
import InputLabel from "../components/InputLabel";

const CadastroWeb = () => {
  return (
    <>
      <NavBar />
      <div className="main-container">
        <BarraLateral>
          <InputLabel label="Cod Fabricante" />
          <InputLabel label="Cod Interno" />
        </BarraLateral>
      </div>
    </>
  );
};
export default CadastroWeb;
