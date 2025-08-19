import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Notas from "./pages/Notas";
import Clientes from "./pages/Clientes";
import Reservas from "./pages/Reservas";
import Fotos from "./pages/Fotos";
import ControlePlaza from "./pages/ControlePlaza";
import CadastroWeb from "./pages/CadastroWeb";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/fotos" element={<Fotos />} />
        <Route path="/cadastro-web" element={<CadastroWeb />} />
      </Routes>
    </Router>
  );
}

export default App;
