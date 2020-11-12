import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import DefaultSideBar from "../../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
// import NodePanel from "./SRModeling_nodes";
import static_menu from "./SideBar";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { new_node } from "../../../components/Cards/SRCard/SRCardModel";
import DynamicSideBar from "../../../components/SideBars/dynamicSidebar";

// Pagina inicial de manejo de nodos:
class SCManage extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sCentral", name: "Sistema Central" },
    navData: [],
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
    msg: "",
    error: false
  };

  async componentDidMount() {
    this._search_root_block();
  }

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => { 
    this.setState({ pinned: btnPin })
  }

  _search_root_block = async () => {
    this.setState({ nodes: [], loading: true, error: false });
    /*
    let path = "/api/admin-sRemoto/nodos/" + this.state.search;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          this.setState({ nodes: [], filter_nodes: [], msg: json.msg });
        } else {
          let nodes = json.nodos;
          nodes.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
          this.setState({ nodes: nodes, filter_nodes: nodes, msg: json.msg });
        }
      })
      .catch((error) => { 
        this.setState({ error: true, msg: "Ha fallado la conexión con la API de cálculo de disponibilidad" });
        console.log(error);
      });
    this.setState({ loading: false });*/
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
        <div className=
          {this.state.pinned ?
          "page-wrapper default-theme sidebar-bg bg1 toggled pinned" :
          "page-wrapper default-theme sidebar-bg bg1 toggled"}
        >
          <DynamicSideBar menu={static_menu()} pinned={this.state.pinned}/>
          <div className="page-content">
           
          </div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SCManage;
