import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import DefaultSideBar from "../../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import menu from "../SideBar";
import { Col, Tabs, Tab } from "react-bootstrap";
import FilterSTRNodes from "../FilterSTRNodes";
import SRModelingRTU from "./Modeling_RTUs/SRModeling_RTUs";
import SRModelingTag from "./Modeling_Tags/SRModeling_Tags";

// Pagina inicial de manejo de nodos:
class SRModelingRTUsOrTags extends Component {
  /* Configuración de la página: */
  state = {
    brand: {
      route: "/Pages/sRemoto/consignaciones/nueva",
      name: "Administración de UTR y Tags",
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

  // permite manejar cambios en el filtrado de nodos
  _handle_filter_STRNodes = (selected, selected_id) => {
    let forma = this.state.forma;
    forma["selected"] = selected;
    forma["selected_id"] = selected_id;
    this.setState({ forma: forma });
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
                id="uncontrolled-tab"
                transition={false}
              >
                <Tab eventKey="dt-mte" title="Información de UTR y Tags">
                  <FilterSTRNodes onChange={this._handle_filter_STRNodes} />
                </Tab>
              </Tabs>
              <Tabs
                defaultActiveKey="dt-entidad"
                id="uncontrolled-tab-mod"
                transition={false}
                variant="pills"
              >
                {this.state.forma["selected"] === undefined ||
                this.state.forma["selected"]["entidad_nombre"] === undefined ? (
                  <></>
                ) : (
                  <Tab
                    eventKey="dt-entidad"
                    title={
                      "Administrar UTRs en " +
                      this.state.forma.selected["entidad_tipo"] +
                      ": " +
                      this.state.forma.selected["entidad_nombre"]
                    }
                  >
                    <SRModelingRTU
                      selected={this.state.forma.selected}
                      selected_id={this.state.forma.selected_id}
                    />
                  </Tab>
                )}
                {this.state.forma["selected"] === undefined ||
                this.state.forma["selected"]["utr_nombre"] === undefined ? (
                  <></>
                ) : (
                  <Tab
                    eventKey="dt-rtu"
                    title={
                      "Administrar Tags en " +
                      this.state.forma.selected["utr_tipo"] +
                      ": " +
                      this.state.forma.selected["utr_nombre"]
                    }
                  >
                    <SRModelingTag
                      selected={this.state.forma.selected}
                      selected_id={this.state.forma.selected_id}
                    />
                  </Tab>
                )}
              </Tabs>
              <Col></Col>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SRModelingRTUsOrTags;
