import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Notas from "./pages/Notas";
import Clientes from "./pages/Clientes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}

export default App;
