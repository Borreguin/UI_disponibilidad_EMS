import React from "react";
import {
  faTools,
  faCalculator,
  faBook,
  faCodeBranch,
  faTags,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Route, BrowserRouter as Router } from "react-router-dom";
import SRManage from "./SRModeling";
import SRCalDisponibilidad from "./SRCalDisponibilidad";

//<Route exact path="/icons" component={IconLibrary} />
export const routing = (
  <Router>
    <Route exact path="/Pages/sRemoto" component={SRManage} />
    <Route
      exact
      path="/Pages/sRemoto/cal/disponibilidad"
      component={SRCalDisponibilidad}
    />
  </Router>
);

function menu() {
  return [
    {
      header: "Modelamiento:",
      navData: [
        {
          route: "/Pages/sRemoto",
          name: "Administración de Nodos",
          icon: faTools,
        },
        {
          route: "/Pages/sRemoto/Tags",
          name: "Administración de UTR y Tags",
          icon: faTags,
        },
        {
          route: "/Pages/sRemotoBackups",
          name: "Versionamiento",
          icon: faCodeBranch,
        },
      ],
    },
    {
      header: "Cálculo",
      navData: [
        {
          route: "/Pages/sRemoto/cal/disponibilidad",
          name: "Disponibilidad",
          icon: faCalculator,
        }
      ],
    },
    {
      header: "Consignaciones",
      navData: [
        {
          route: "/Pages/sRemoto/consignaciones/nueva",
          name: "Añadir",
          icon: faBook,
        },
        {
          route: "/Pages/sRemoto/consignaciones/consultar",
          name: "Consultar",
          icon: faSearch,
        }
      ],
    },
  ];
}
export default menu;