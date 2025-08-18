import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const styleLinks = "text-center w-4 mb-2";
  return (
    <div className="home w-full h-screen flex align-items-center justify-content-center">
      <div className="p-4 flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-30rem h-6 max-h-20rem ">
        <div className="w-10 flex flex-wrap align-items-center justify-content-around">
          <div className={styleLinks}>
            <Button
              icon="pi pi-box"
              rounded
              severity="info"
              aria-label="Box"
              onClick={() => navigate("/produtos")}
            />
            <p className="bebas">Produtos</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="pi pi-book"
              rounded
              severity="info"
              aria-label="Book"
              onClick={() => navigate("/notas")}
            />
            <p className="bebas">Notas</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="pi pi-user"
              rounded
              severity="info"
              aria-label="User"
              onClick={() => navigate("/clientes")}
            />
            <p className="bebas">Clientes</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="fa fa-cart-shopping"
              rounded
              severity="info"
              aria-label="List"
              onClick={() => navigate("/pedidos")}
            />
            <p className="bebas">Pedidos</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="fa fa-box-archive"
              rounded
              severity="info"
              aria-label="List"
              onClick={() => navigate("/reservas")}
            />
            <p className="bebas">Reservas</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="fa fa-camera"
              rounded
              severity="info"
              aria-label="List"
              onClick={() => navigate("/fotos")}
            />
            <p className="bebas">Fotos</p>
          </div>
          <div className={styleLinks}>
            <Button
              icon="fa fa-table"
              rounded
              severity="info"
              aria-label="List"
              onClick={() => navigate("/cadastro-web")}
            />
            <p className="bebas">Cadastro Web</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
