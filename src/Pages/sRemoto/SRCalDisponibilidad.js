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
} from "../../components/DatePicker/DateRange";
import ReactJson from "react-json-view";
import NodeReport from "./SRCalDisponibilidad_nodes";

// Pagina inicial de manejo de nodos:
class SRCalDisponibilidad extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sRemoto", name: "Cálculo de disponibilidad " },
    navData: [],
    nodes: undefined,
    search: "",
    loading: true,
    calculating: false,
    ini_date: new Date(),
    end_date: new Date(),
    log: { estado: "Listo para realizar cálculo" },
    edited: false,
  };

  async componentDidMount() {
    this._search_nodes_now();
  }

  // permite manejar los cambios ocurridos en el hijo:
  // new_entities viene desde el hijo como consecuencia
  // de un cambio
  handle_picker_change = (ini_date, end_date) => {
    this.setState({ ini_date: ini_date, end_date: end_date });
  };

  _search_nodes_now = async () => {
    this.setState({ nodes: undefined, loading: true });
    await fetch("/api/admin-sRemoto/nodos/" + this.state.search)
      .then((res) => res.json())
      .then((nodes) => {
        this.setState({ nodes: nodes });
      })
      .catch(console.log);
    this.setState({ loading: false });
  };

  _update_search = (e) => {
    this.setState({ search: e.target.value.trim() });
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }

    if (this.state.nodes === undefined || this.state.nodes.length === 0) {
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

  _range_time = () => {
    return (
      to_yyyy_mm_dd(this.state.ini_date) +
      "/" +
      to_yyyy_mm_dd(this.state.end_date)
    );
  };

  _nodes_names = () => {
    let node_names = [];
    if (this.state.nodes !== undefined)
      this.state.nodes.forEach((node) => {
        node_names.push(node.nombre);
      });
    return node_names;
  };

  _cal_all = async (method) => {
    let msg = "";
    if (method === "POST") {
      msg = "Empezando cálculo de los nodos: \n";
    } else {
      msg = "Empezando rescritura de cálculos de los nodos: \n";
    }

    this.setState({
      log: {
        estado: "Iniciando",
        mensaje: msg + this._nodes_names(),
      },
      edited: true,
      calculating: true
    });
    let path = "";
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (this.state.search === "" && this.state.nodes.length > 0) {
      path = "/api/disp-sRemoto/disponibilidad/" + this._range_time();
    } else if (this.state.search !== "" && this.state.nodes.length > 0) {
      path = "/api/disp-sRemoto/disponibilidad/nodos/" + this._range_time();
      payload["body"] = JSON.stringify({ nodos: this._nodes_names() });
    }
    await fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        if (json.errors !== undefined) {
          this.setState({ log: json.errors, edited: true, calculating: false});
        } else {
          json["estado"] = "Finalizado";
          this.setState({ log: json, edited: true, calculating: false });
        }
      });
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
        />
        <div className="page-wrapper default-theme sidebar-bg bg1 toggled">
          <DefaultSideBar menu={menu()} />
          <div className="page-content">
            <Form.Group as={Row} className="sc-search">
              <Form.Label column sm="3" className="sc-pick-menu">
                <DateRange
                  last_month={true}
                  onPickerChange={this.handle_picker_change}
                ></DateRange>
              </Form.Label>
              <Form.Label column sm="2" className="sc-btn-search">
                <Button
                  variant="outline-dark"
                  onClick={this._search_nodes_now}
                  disabled={this.state.nodes === undefined || this.state.calculating}
                  className="btn-search"
                >
                  Buscar
                </Button>
              </Form.Label>

              <Col sm="6" className="sc-search-input">
                <Form.Control
                  type="text"
                  onBlur={this._update_search}
                  placeholder="Nodo a buscar"
                />
              </Col>
              <div className="sc-btn-cal">
                <Button
                  variant="outline-light"
                  className={this.state.loading || this.state.calculating? "btn-cal-disp-dis": "btn-cal-disp"}
                  onClick={() => this._cal_all("POST")}
                >
                  <FontAwesomeIcon inverse icon={faPencilAlt} size="lg" />{" "}
                  CALCULAR TODOS
                </Button>
                <Button
                  variant="outline-light"
                  className={this.state.loading || this.state.calculating? "btn-cal-disp-dis": "btn-cal-disp"}
                  onClick={() => this._cal_all("PUT")}
                >
                  <FontAwesomeIcon inverse icon={faPenFancy} size="lg" />{" "}
                  RE-ESCRIBIR CÁLCULO
                </Button>
              </div>
              <div className="sc-btn-cal">
                <div
                  className={
                    this.state.edited ? "sc-log-changed" : "sc-log-normal"
                  }
                  onClick={() => {
                    this.setState({ edited: false });
                  }}
                >
                  <ReactJson
                    name="info"
                    displayObjectSize={true}
                    collapsed={true}
                    iconStyle="circle"
                    displayDataTypes={false}
                    theme="monokai"
                    src={this.state.log}
                  />
                </div>
              </div>
              <div style={{ marginLeft: "15px" }}>{this._notification()}</div>
            </Form.Group>
            <div className="div-cards">
              {this.state.loading ||
              this.state.nodes === undefined ||
              this.state.nodes.length === 0 ? (
                <div></div>
              ) : (
                  <NodeReport nodes={this.state.nodes}
                    ini_date={this.state.ini_date}
                    end_date={this.state.end_date}
                    calculating={this.state.calculating}
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

export default SRCalDisponibilidad;
