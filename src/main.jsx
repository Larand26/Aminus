import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import do font awesome
import "@fortawesome/fontawesome-free/css/all.min.css"; // Font Awesome

createRoot(document.getElementById("root")).render(<App />);
