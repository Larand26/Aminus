import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Clients from "./pages/Clients";
import Reservations from "./pages/Reservations";
import Photos from "./pages/Photos";
import WebRegistration from "./pages/WebRegistration";
import Login from "./pages/Login";
import WhatsApp from "./pages/Whatsapp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/web-registration" element={<WebRegistration />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
      </Routes>
    </Router>
  );
}

export default App;
