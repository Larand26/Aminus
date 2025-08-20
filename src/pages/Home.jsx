import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const styleLinks = "text-center w-4 mb-2";

  const buttons = [
    {
      icon: "pi pi-box",
      link: "/produtos",
      label: "Produtos",
      ids: [1, 2, 3, 4],
    },
    {
      icon: "pi pi-book",
      link: "/notas",
      label: "Notas",
      ids: [1, 2, 3, 4],
    },
    {
      icon: "pi pi-user",
      link: "/clientes",
      label: "Clientes",
      ids: [1, 2, 3],
    },
    {
      icon: "fa fa-cart-shopping",
      link: "/pedidos",
      label: "Pedidos",
      ids: [1, 2, 3, 4],
    },
    {
      icon: "fa fa-box-archive",
      link: "/reservas",
      label: "Reservas",
      ids: [1, 3],
    },
    {
      icon: "fa fa-camera",
      link: "/fotos",
      label: "Fotos",
      ids: [1, 2, 3, 4],
    },
    {
      icon: "fa fa-table",
      link: "/cadastro-web",
      label: "Cadastro Web",
      ids: [1, 3],
    },
    {
      icon: "fa fa-truck",
      link: "/tracking",
      label: "Tracking",
      ids: [1, 2, 3],
    },
  ];

  const renderButtons = () => {
    return buttons
      .filter((button) =>
        button.ids.includes(parseInt(localStorage.getItem("userFuncao")))
      )
      .map((button) => (
        <div className={styleLinks} key={button.label}>
          <Button
            icon={button.icon}
            rounded
            severity="info"
            aria-label={button.label}
            onClick={() => navigate(button.link)}
          />
          <p className="bebas">{button.label}</p>
        </div>
      ));
  };

  return (
    <div className="home w-full h-screen flex align-items-center justify-content-center">
      <div className="p-4 flex flex-column align-items-center justify-content-around bg-primary w-11 max-w-30rem h-6 max-h-20rem ">
        <div className="w-10 flex flex-wrap align-items-center justify-content-around">
          {renderButtons()}
        </div>
      </div>
    </div>
  );
};

export default Home;
