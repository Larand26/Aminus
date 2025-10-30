import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Card from "../components/Card";

import pages from "../assets/json/pages.json";

import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  // Usuário
  const idFuncao = JSON.parse(localStorage.getItem("ID_FUNCAO_USUARIO"));

  return (
    <div>
      <NavBar page="home" />
      <div className="home-container">
        {pages.map((page) => {
          if (page.restrition.includes(idFuncao)) return null;
          return (
            <Card
              className="hover-card"
              key={page.page}
              icon={page.icon}
              onClick={() => navigate(page.path)}
            >
              <div className="card-container">
                <p>{page.title}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
