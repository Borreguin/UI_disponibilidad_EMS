import React, { Component } from "react";
import DefaultNavBar from "../../components/NavBars/default";
import DefaultFooter from "../../components/NavBars/footer";
import DefaultSideBar from "../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import menu from "./SideBar";
import { Col, Tabs, Tab } from "react-bootstrap";
import DatosConsultar from "./SRConsignacionesConsultar_Form";

// Pagina inicial de manejo de nodos:
class SRConsignacionesConsultar extends Component {
  /* Configuración de la página: */
  state = {
    brand: {
      route: "/Pages/sRemoto/consignaciones/consultar",
      name: "Consultar consignación",
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
                <Tab eventKey="dt-mte" title="Datos de consignación a consultar">
                  <DatosConsultar
                    onChange={this.handle_datos_mantenimiento}
                  ></DatosConsultar>
                </Tab>
              </Tabs>
              <Col>
                <br></br>
                
              </Col>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SRConsignacionesConsultar;
