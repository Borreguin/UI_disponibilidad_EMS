import React, { Component } from "react";
import DefaultNavBar from "../../components/NavBars/default";
import DefaultFooter from "../../components/NavBars/footer";
import DefaultSideBar from "../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import menu from "./SideBar";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPenFancy } from "@fortawesome/free-solid-svg-icons";
import {
  DateRange,
  to_yyyy_mm_dd,
  get_last_month_dates,
} from "../../components/DatePicker/DateRange";
import ReactJson from "react-json-view";
import NodeReport from "./SRCalDisponibilidad_nodes";
import SRGeneralReport from "../../components/Reports/SRReport/GeneralReport";

// Pagina inicial de manejo de nodos:
class SRConsignaciones extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sRemoto/consignaciones/nueva", name: "Ingresar consignación" },
    navData: [],
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
  };

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => { 
    this.setState({ pinned: btnPin })
  }

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <React.Fragment>
        <DefaultNavBar
          bg="dark"
          variant="dark"
          brand={this.state.brand}
          navData={this.state.navData}
          showpinned={true}
          onClickBtnPin={this.handle_onClickBtnPin}
        />
        <div className=
          {this.state.pinned ?
          "page-wrapper default-theme sidebar-bg bg1 toggled pinned" :
          "page-wrapper default-theme sidebar-bg bg1 toggled"}
        >
        <DefaultSideBar menu={menu()} pinned={this.state.pinned} />
        <div className="page-content"></div>
                

        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SRConsignaciones;
