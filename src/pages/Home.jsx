import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home w-full h-screen flex align-items-center justify-content-center">
      <div className="p-4 flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-30rem h-6 max-h-20rem ">
        <div></div>
        <div className="w-10 flex flex-wrap align-items-center justify-content-around">
          <Button
            icon="pi pi-box"
            rounded
            severity="info"
            aria-label="Box"
            onClick={() => navigate("/produtos")}
          />
          <Button
            icon="pi pi-book"
            rounded
            severity="info"
            aria-label="Book"
            onClick={() => navigate("/notas")}
          />
          <Button
            icon="pi pi-user"
            rounded
            severity="info"
            aria-label="User"
            onClick={() => navigate("/clientes")}
          />
          <Button
            icon="fa fa-cart-shopping"
            rounded
            severity="info"
            aria-label="List"
            onClick={() => navigate("/pedidos")}
          />
          <Button
            icon="fa fa-box-archive"
            rounded
            severity="info"
            aria-label="List"
            onClick={() => navigate("/reservas")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
