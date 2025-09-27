import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDOMSafety } from "./lib/domUtils";

// Initialize DOM safety utilities first
initDOMSafety();

createRoot(document.getElementById("root")!).render(<App />);
