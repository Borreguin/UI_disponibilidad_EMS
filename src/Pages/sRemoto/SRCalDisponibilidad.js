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
class SRCalDisponibilidad extends Component {
  /* Configuración de la página: */
  constructor(props) {
    super(props);
    let r = get_last_month_dates();
    this.state = {
      ini_date: r.first_day_month,
      end_date: r.last_day_month,
      brand: { route: "/Pages/sRemoto", name: "Cálculo de disponibilidad " },
      navData: [],
      filtered_reports: undefined, // lista de reportes filtrados
      report: undefined, // reporte entero
      search: "", // filtrar reportes
      loading: true,
      calculating: false,
      log: { estado: "Listo para realizar cálculo" },
      edited: false,
    };
  }

  async componentDidMount() {
    this._search_report_now();
  }

  // permite manejar los cambios ocurridos en los hijos:
  handle_picker_change = (ini_date, end_date) => {
    this.setState({ ini_date: ini_date, end_date: end_date });
  };

  // permite manejar cambios ocurridos en detalle de cálculo:
  handle_calculation_details = () => {
    this._search_report_now();
  };

  _search_report_now = async () => {
    if (String(this.state.ini_date) === String(this.state.end_date)) {
      this.setState({
        loading: false,
        edited: true,
        calculating: false,
        log: { msg: "Seleccione fechas distintas para el cálculo" },
      });
      return;
    }
    this.setState({
      filtered_reports: undefined,
      loading: true,
      report: undefined,
    });
    await fetch("/api/disp-sRemoto/disponibilidad/" + this._range_time())
      .then((res) => res.json())
      .then((report) => {
        if (report.errors === undefined) {
          this.setState({
            report: report,
          });
          this._filter_reports(this.state.search);
        }
        if (report.novedades !== undefined) {
          this.setState({ log: report.novedades.detalle });
        }
      })
      .catch(console.log);
    this.setState({ loading: false });
  };

  _update_search = (e) => {
    this.setState({ search: e.target.value.trim() });
  };

  _filter_reports = (e) => {
    let to_filter = "";
    if (e.target !== undefined) {
      to_filter = String(e.target.value).toLowerCase();
    } else {
      to_filter = String(e).toLowerCase();
    }
    let filtered_reports = [];
    if (to_filter === "" && this.state.report !== undefined) {
      this.setState({ filtered_reports: this.state.report.reportes_nodos });
    } else if (this.state.report !== undefined) {
      this.state.report.reportes_nodos.forEach((report, ix) => {
        if (report.nombre.toLowerCase().includes(to_filter)) {
          filtered_reports.push(this.state.report.reportes_nodos[ix]);
        }
      });
      this.setState({ filtered_reports: filtered_reports });
    }
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }

    if (this.state.report === undefined) {
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
        <span>
          {
            " No hay resultados para la búsqueda, el cálculo en referencia no existe."
          }
        </span>
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
    if (this.state.filtered_reports !== undefined)
      this.state.filtered_reports.forEach((report) => {
        node_names.push(report.nombre);
      });
    return node_names;
  };

  _cal_all = async (method) => {
    let msg = "";
    let pcc =
      this.state.search === "" ? "todos los nodos" : this._nodes_names();

    if (method === "POST") {
      msg = "Empezando cálculo de " + pcc;
    } else {
      msg = "Empezando rescritura de " + pcc;
    }
    this.setState({
      log: {
        estado: "Iniciando",
        mensaje: msg,
      },
      edited: true,
      calculating: true,
    });
    let path = "";
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (this.state.search === "") {
      path = "/api/disp-sRemoto/disponibilidad/" + this._range_time();
    } else if (
      this.state.search !== "" &&
      this.state.report !== undefined &&
      this.state.report.reportes_nodos.length > 0
    ) {
      path = "/api/disp-sRemoto/disponibilidad/nodos/" + this._range_time();
      payload["body"] = JSON.stringify({ nodos: this._nodes_names() });
    }

    await fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ loading: true });
        if (json.errors !== undefined) {
          this.setState({ log: json.errors, edited: true, calculating: false });
        } else {
          json["estado"] = "Finalizado";
          this.setState({
            log: json,
            edited: true,
            calculating: false,
            report: json.report,
          });
        }
      });
    this._filter_reports(this.state.search);
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
                  onClick={this._search_report_now}
                  disabled={this.state.loading || this.state.calculating}
                  className="btn-search"
                >
                  Actualizar
                </Button>
              </Form.Label>

              <Col sm="6" className="sc-search-input">
                <Form.Control
                  type="text"
                  onBlur={this._update_search}
                  onChange={this._filter_reports}
                  placeholder="Nodo a buscar"
                  disabled={this.state.calculating}
                />
              </Col>
              <div className="sc-body-cal">
                <Button
                  variant="outline-light"
                  className={
                    this.state.loading || this.state.calculating
                      ? "btn-cal-disp-dis"
                      : "btn-cal-disp"
                  }
                  onClick={() => this._cal_all("POST")}
                >
                  <FontAwesomeIcon inverse icon={faPencilAlt} size="lg" />{" "}
                  CALCULAR TODOS
                </Button>
                <Button
                  variant="outline-light"
                  className={
                    this.state.loading || this.state.calculating
                      ? "btn-cal-disp-dis"
                      : "btn-cal-disp"
                  }
                  onClick={() => this._cal_all("PUT")}
                >
                  <FontAwesomeIcon inverse icon={faPenFancy} size="lg" />{" "}
                  RE-ESCRIBIR CÁLCULO
                </Button>
              </div>
            </Form.Group>
            <div className="div-cards">
              {this.state.report === undefined ? (
                <></>
              ) : (
                <SRGeneralReport
                  report={this.state.report}
                  calculating={this.state.calculating}
                />
              )}

              <div className="sc-body-cal">
                <div
                  className={
                    this.state.edited ? "sc-log-changed" : "sc-log-normal"
                  }
                  onClick={() => {
                    this.setState({ edited: false });
                  }}
                >
                  <ReactJson
                    name="novedades"
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

              {this.state.loading ? (
                <div></div>
              ) : (
                <div className="sc-src-details">
                  <div className="subtitle-details">DETALLES DE CÁLCULO </div>
                  <NodeReport
                    reports={this.state.filtered_reports}
                    ini_date={this.state.ini_date}
                    end_date={this.state.end_date}
                    calculating={this.state.calculating}
                    onChange={this.handle_calculation_details}
                  />
                </div>
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
