import { useNavigate } from "react-router-dom";

import "../styles/menu-meu-perfil.css";

// 1. Receba as props: onOpenMeuPerfil, isOpen
const MenuMeuPerfil = ({ onOpenMeuPerfil, isOpen }) => {
  const navigate = useNavigate();

  // 2. Função de logout para limpar o storage e redirecionar
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  // 3. Use a prop 'isOpen' para controlar a classe do menu
  const menuClassName = `menu-meu-perfil ${isOpen ? "open-menu" : ""}`;

  return (
    <div className={menuClassName}>
      <ul>
        <li>
          {/* 4. O botão agora chama a função recebida via props */}
          <button onClick={onOpenMeuPerfil}>
            Meu Perfil <i className="fa fa-user"></i>
          </button>
        </li>
        <li>
          <button onClick={handleLogout}>
            Sair <i className="fa fa-sign-out"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MenuMeuPerfil;
