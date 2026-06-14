import { Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Dashboard from "./components/pages/Dashboard";
import Tickets from "./components/pages/Tickets";
import Giveaways from "./components/pages/Giveaways";
import EmbedBuilder from "./components/pages/EmbedBuilder";
import Commands from "./components/pages/Commands";
import SettingsPage from "./components/pages/Settings";
import NotFound from "./components/pages/NotFound";

export const routers = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "tickets", element: <Tickets /> },
      { path: "giveaways", element: <Giveaways /> },
      { path: "embeds", element: <EmbedBuilder /> },
      { path: "commands", element: <Commands /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
