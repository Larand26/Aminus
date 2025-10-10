import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
    </div>
  );
};

export default Home;
