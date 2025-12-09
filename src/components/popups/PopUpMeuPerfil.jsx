import { useState } from "react";

import "../../styles/pop-up-meu-perfil.css";

import imgPadrao from "../../assets/img/png/logo_png.png";
import searchTotalPedidos from "../../utils/search/searchTotalPedidos";

const PopUpMeuPerfil = () => {
  const [userData, setUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : {}
  );

  const handleSearchTotalPedidos = async () => {
    try {
      const filter = { nomeVendedor: userData.NOME };
      const response = await searchTotalPedidos(filter);
      console.log(response);
    } catch (error) {}
  };

  return (
    <div className="pop-up-meu-perfil">
      <div className="foto-perfil-container">
        <div className="foto-perfil">
          <img src={imgPadrao} alt="Foto de Perfil" />
        </div>
        <button onClick={handleSearchTotalPedidos}>Mudar Foto</button>
      </div>
      <div>
        <div>
          <p className="nome">{userData.NOME}</p>
          <p className="cargo">{userData.DESCRICAO}</p>
        </div>
        <div className="informacoes"></div>
      </div>
    </div>
  );
};
export default PopUpMeuPerfil;
