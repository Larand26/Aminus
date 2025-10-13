import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Card from "../components/Card";

import pages from "../assets/json/pages.json";

import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar page="home" />
      <div className="home-container">
        {pages.map((page) => (
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
        ))}
      </div>
    </div>
  );
};

export default Home;
