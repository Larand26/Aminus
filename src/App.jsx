import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Produtos from "./pages/Produtos";
import Notas from "./pages/Notas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </Router>
  );
}

export default App;
