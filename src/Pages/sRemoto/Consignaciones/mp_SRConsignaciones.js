// TODO: pasar a producción
import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import DefaultSideBar from "../../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import menu from "../SideBar";
import { Col, Button, Tabs, Tab, Alert } from "react-bootstrap";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../../components/DatePicker/DateRangeTime";
import DatosMantenimiento from "./SRConsignaciones_DatosMantenimiento";
import { SRM_API_URL } from "../Constantes";

// Pagina inicial de manejo de nodos:
class SRConsignaciones extends Component {
  /* Configuración de la página: */
  state = {
    brand: {
      route: "/Pages/sRemoto/consignaciones/nueva",
      name: "Ingresar consignación",
    },
    navData: [],
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
    forma: {},
    active: false,
    log: "",
    success: false,
  };

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

  // permite obtener datos del componente:
  handle_datos_mantenimiento = (forma) => {
    this.setState({ forma: forma });
    this.check_values();
  };

  // check values to let send the information
  check_values = () => {
    let valid = true;
    // check no_consignacion
    valid =
      valid &&
      this.state.forma["no_consignacion"] !== undefined &&
      this.state.forma["no_consignacion"].length > 3;

    // check selección UTR
    valid =
      valid &&
      this.state.forma["selected_id"] !== undefined &&
      this.state.forma.selected_id["utr"] !== undefined;
    this.setState({ active: valid });
  };

  // enviar consignación:

  _send_consignacion = () => {
    let msg =
      "Desea ingresar la siguiente consignación? \n\n" +
      this.state.forma.selected["utr_tipo"] +
      ": \t\t\t" +
      this.state.forma.selected["utr_nombre"] +
      "\n" +
      "No. consignación: \t" +
      this.state.forma.no_consignacion +
      "\n" +
      "Inicio: \t\t\t\t" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma["fecha_inicio"]) +
      "\n" +
      "Fin:    \t\t\t\t" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma["fecha_final"]);
    let r = window.confirm(msg);
    if (r === false) return;

    let path =
      SRM_API_URL + "/admin-consignacion/consignacion/" +
      this.state.forma.selected_id.utr +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_inicio) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_final);
    let payload = {
      elemento: this.state.forma.selected,
      no_consignacion: this.state.forma["no_consignacion"],
      detalle: {observaciones: this.state.forma.detalle },
    };
    fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ log: result.msg, success: result.success });
      })
      .catch(console.log);
  };

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
        <div
          className={
            this.state.pinned
              ? "page-wrapper default-theme sidebar-bg bg1 toggled pinned"
              : "page-wrapper default-theme sidebar-bg bg1 toggled"
          }
        >
          <DefaultSideBar menu={menu()} pinned={this.state.pinned} />
          <div className="page-content">
            <div className="cons-container">
              <Tabs
                defaultActiveKey="dt-mte"
                id="uncontrolled-tab-example"
                transition={false}
              >
                <Tab eventKey="dt-mte" title="Datos Consignación">
                  <DatosMantenimiento
                    onChange={this.handle_datos_mantenimiento}
                  ></DatosMantenimiento>
                </Tab>
              </Tabs>
              <Col>
                <br></br>
                {!this.state.active ? (
                  <div>
                    Los campos con (<span className="cons-mandatory">*</span>)
                    son mandatorios
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="primary"
                      disabled={!this.state.active}
                      onClick={this._send_consignacion}
                    >
                      Ingresar consignación
                    </Button>
                    {this.state.log.length === 0 ? (
                      <></>
                    ) : (
                      <Alert
                        className="cns-info"
                        variant={this.state.success ? "success" : "warning"}
                      >
                        {this.state.log}
                      </Alert>
                    )}
                  </div>
                )}
              </Col>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SRConsignaciones;
