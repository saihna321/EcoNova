import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { SatelliteViewer } from "./components/SatelliteViewer";
import { Sites } from "./components/Sites";
import { Reports } from "./components/Reports";
import { Alerts } from "./components/Alerts";
import { NotFound, RouteError } from "./components/RouteError";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: Dashboard },
      { path: "satellite", Component: SatelliteViewer },
      { path: "sites", Component: Sites },
      { path: "reports", Component: Reports },
      { path: "alerts", Component: Alerts },
      { path: "*", Component: NotFound },
    ],
  },
]);
