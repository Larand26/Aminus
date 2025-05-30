import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import dos primefaces e primeflex
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/themes/primeone-dark.css"; // dark theme
import "primeflex/themes/primeone-light.css"; // dark theme

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
