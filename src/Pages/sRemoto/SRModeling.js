import React, { Component } from "react";
import DefaultNavBar from "../../components/NavBars/default";
import DefaultFooter from "../../components/NavBars/footer";
import DefaultSideBar from "../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import NodePanel from "./SRModeling_nodes";
import menu from "./SideBar";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { new_node } from "../../components/Cards/SRCard/SRCardModel";

// Pagina inicial de manejo de nodos:
class SRManage extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sRemoto", name: "Sistema Remoto" },
    navData: [],
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
  };

  async componentDidMount() {
    this._search_nodes_now();
  }

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => { 
    this.setState({ pinned: btnPin })
  }

  _search_nodes_now = async () => {
    this.setState({ nodes: [], loading: true });
    let path = "/api/admin-sRemoto/nodos/" + this.state.search;
    await fetch(path)
      .then((res) => res.json())
      .then((nodes) => {
        if (nodes.errors !== undefined) {
          this.setState({ nodes: [], filter_nodes: [] });
        } else {
          this.setState({ nodes: nodes, filter_nodes: nodes });
        }
      })
      .catch(console.log);
    this.setState({ loading: false });
  };

  _filter = (e) => {
    let filtered_nodes = [];
    let to_filter = e.target.value.toLowerCase();
    if (this.state.nodes.length === 0) return;
    this.state.nodes.forEach((node) => {
      if (node.nombre.toLowerCase().includes(to_filter)) {
        filtered_nodes.push(node);
      }
    });
    this.setState({ filter_nodes: filtered_nodes });
  };

  _update_search = (e) => {
    this.setState({ search: e.target.value.trim() });
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }

    if (this.state.nodes.length === 0) {
      return this._not_found();
    }
  };

  _loading = () => {
    return (
      <div>
        <Spinner animation="border" role="status" size="sm" />
        <span> Espere por favor, cargando ...</span>
      </div>
    );
  };

  _not_found = () => {
    return (
      <div>
        <span> No hay resultados para la búsqueda...</span>
      </div>
    );
  };

  _add_node = () => {
      this.setState({ loading: true });
      let lcl_nodes = [new_node()];
      lcl_nodes = lcl_nodes.concat(this.state.nodes);
      this.setState({ nodes: lcl_nodes, filter_nodes: lcl_nodes });
      this.setState({ loading: false });
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
          <DefaultSideBar menu={menu()} pinned={this.state.pinned}/>
          <div className="page-content">
            <Form.Group as={Row} className="sc-search">
              <Form.Label column sm="2" className="sc-btn-search">
                <Button
                  variant="outline-dark"
                  onClick={this._search_nodes_now}
                  disabled={this.state.nodes.length === 0}
                  className="btn-search"
                >
                  Actualizar
                </Button>
              </Form.Label>
              <Col sm="8" className="sc-search-input">
                <Form.Control
                  type="text"
                  onBlur={this._update_search}
                  onChange={this._filter}
                  placeholder="Nodo a buscar"
                />
              </Col>
              <Button
                variant="outline-light"
                className="btn-add-node"
                disabled={this.state.loading}
                onClick={this._add_node}
              >
                <FontAwesomeIcon inverse icon={faPlusCircle} size="lg" />
              </Button>
              <div style={{ marginLeft: "15px" }}>{this._notification()}</div>
            </Form.Group>
            <div className="div-cards">
              {this.state.loading || this.state.nodes.length === 0 ? (
                <div></div>
              ) : (
                <NodePanel nodes={this.state.filter_nodes} />
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
