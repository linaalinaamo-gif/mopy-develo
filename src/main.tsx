import { createRoot } from "react-dom/client";
import "./components/i18n/config.ts";
import { bootstrapGeneratedSiteAnalytics } from "./analytics.ts";
import App from "./app.tsx";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found.");
}

bootstrapGeneratedSiteAnalytics();

createRoot(container).render(<App />);



