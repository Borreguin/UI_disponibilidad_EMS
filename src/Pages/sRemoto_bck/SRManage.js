import React, { Component } from "react";
import DefaultNavBar from "../../components/NavBars/default";
import DefaultFooter from "../../components/NavBars/footer";
import DefaultSideBar from "../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import NodeCanvas from "./SRManage_nodes";
import menu from "./SideBar";
import { Spinner } from "react-bootstrap";
import { SRM_API_URL } from "../sRemoto/Constantes";

class SRManage extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "./sRemoto", name: "Sistema Remoto" },
    navData: [],
    nodes: undefined,
    diagram: undefined,
  };

  async componentDidMount() {
    //super(props);
    fetch(SRM_API_URL + "/admin-sRemoto/nodos/")
      .then((res) => res.json())
      .then((nodes) => {
        this.setState({ nodes: nodes });
      })
      .catch(console.log);
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
        />
        <div className="page-wrapper default-theme sidebar-bg bg1 toggled">
          <DefaultSideBar menu={menu()} />
          <div className="page-content">
            <div className="div-diagram">
              {this.state.nodes === undefined ? (
                <div>
                  <Spinner animation="border" role="status" size="sm" />
                  <span> Espere por favor, cargando ...</span>
                </div>
              ) : (
                <NodeCanvas
                  nodes={this.state.nodes}
                  diagram={this.state.diagram}
                />
              )}
            </div>
          </div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SRManage;
