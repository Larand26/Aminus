import "../../styles/pop-up-meu-perfil.css";

import imgPadrao from "../../assets/img/png/logo_png.png";

const PopUpMeuPerfil = () => {
  return (
    <div className="pop-up-meu-perfil">
      <div className="foto-perfil-container">
        <div className="foto-perfil">
          <img src={imgPadrao} alt="Foto de Perfil" />
        </div>
        <button>Mudar Foto</button>
      </div>
      <div>
        <div>
          <p className="nome">{localStorage.getItem("username")}</p>
          <p className="cargo">ADMININTRADOR</p>
        </div>
        <div className="informacoes"></div>
      </div>
    </div>
  );
};
export default PopUpMeuPerfil;
