import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import DefaultSideBar from "../../../components/SideBars/default";
import "bootstrap/dist/css/bootstrap.min.css";
import menu from "../SideBar";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPenFancy,
  faTag, faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import {
  to_yyyy_mm_dd,
  get_last_month_dates,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../../../components/DatePicker/DateRange";
import { DateRangeTime } from "../../../components/DatePicker/DateRangeTime";
import ReactJson from "react-json-view";
import NodeReport from "./SRCalDisponibilidad_nodes";
import SRGeneralReport from "../../../components/Reports/SRReport/GeneralReport";
import { SRM_API_URL } from "../Constantes";
import ReactTooltip from "react-tooltip";
import * as _ from "lodash";

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
      umbral: 0,
      log: { estado: "Cargando información ..." },
      edited: false,
      msg: "",
    };
  }

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

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

  // cuando finaliza el cálculo
  handle_finish_calculation = (calculation_log) => {
    if (this.state.calculating) {
      this.setState({ calculating: false, log: calculation_log });
    }
    this._search_report_now();
  };

  // actualiza el valor del umbral a reportar:
  _updateUmbral = (e) => {
    let umbral = parseFloat(e.target.value.trim());
    if (!isNaN(umbral)) {
      this.setState({ umbral: umbral });
    }
  };

  _search_report_now = async () => {
    // buscar el reporte en el periodo
    if (String(this.state.ini_date) === String(this.state.end_date)) {
      let msg = "Seleccione fechas distintas para el cálculo";
      this.setState({
        loading: false,
        edited: true,
        calculating: false,
        log: { msg: msg },
        msg: msg,
        umbral: 0,
      });
      return;
    }
    this.setState({
      filtered_reports: undefined,
      loading: true,
      report: undefined,
      calculating: false,
    });
    await fetch(
      SRM_API_URL + "/disp-sRemoto/disponibilidad/" + this._range_time()
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            report: json.report,
          });
          this._filter_reports(this.state.search);
        } else {
          this.setState({ msg: json.msg });
        }
        // cargando novedades en caso existan:
        if (
          json.report !== undefined &&
          json.report.novedades !== undefined &&
          json.report.novedades.detalle !== undefined
        ) {
          this.setState({ log: json.report.novedades.detalle });
        }
      })
      .catch((error) => {
        let msg =
          "Ha fallado la conexión con la API de cálculo de disponibilidad";
        this.setState({ log: { error: msg }, msg: msg });
        console.log(error);
      });
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
      return this._show_message();
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

  _show_message = () => {
    let msg = this.state.msg;
    if (typeof(this.state.msg) !== "string") { 
      msg = "Observar novedades para más detalles"
    }
    return (
      <div>
        <span>{msg}</span>
      </div>
    );
  };

  _range_time = () => {
    return (
      to_yyyy_mm_dd_hh_mm_ss(this.state.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.end_date)
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

  // descargar reporte Excel:
  _download_excel_report = async () =>{
    let url = SRM_API_URL + "/sRemoto/disponibilidad/excel/" + this._range_time() + "?nid=" + _.uniqueId(Math.random());
    let filename = "Reporte_" + to_yyyy_mm_dd(this.state.ini_date) + "@" + to_yyyy_mm_dd(this.state.end_date) + ".xlsx"
    this.setState({
      log: { estado: "Iniciando descarga de reporte, espere por favor" },
      loading: true,
    });
    await fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
    this.setState({
      log: { estado: "Descarga de reporte finalizado" },
      loading: false,
    });
  }

  // descargar reporte de tags:
  _download_tag_report = async () => {
    let url =
      SRM_API_URL +
      "/sRemoto/indisponibilidad/tags/excel/" +
      this._range_time() +
      "/" +
      this.state.umbral +
      "?nid=" +
      _.uniqueId(Math.random());
    this.setState({
      log: { estado: "Iniciando descarga de reporte, espere por favor" },
      loading: true,
    });
    let filename = "IndispTag_" + to_yyyy_mm_dd(this.state.ini_date) + "@" + to_yyyy_mm_dd(this.state.end_date) + ".xlsx"
    await fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
    this.setState({
      log: { estado: "Descarga de reporte finalizado" },
      loading: false,
    });

  };

  // Realizar el cálculo de los nodos existentes en base de datos
  // El estado calculating permite identificar el momento en que se realiza los cálculos
  _cal_all = (method) => {
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
      msg: "",
    });
    let path = "";
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (this.state.search === "") {
      path = SRM_API_URL + "/disp-sRemoto/disponibilidad/" + this._range_time();
    } else if (
      this.state.search !== "" &&
      this.state.report !== undefined &&
      this.state.report.reportes_nodos.length > 0
    ) {
      path =
        SRM_API_URL +
        "/disp-sRemoto/disponibilidad/nodos/" +
        this._range_time();
      payload["body"] = JSON.stringify({ nodos: this._nodes_names() });
    }

    fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ loading: true });
        if (!json.success) {
          this.setState({
            log: { error: json.msg },
            edited: true,
            calculating: false,
            msg: json.msg,
            loading: false,
          });
        } else {
          this.setState({
            log: { msg: json.msg },
            edited: true,
            calculating: false,
            loading: false,
            report: json.report,
            msg: json.msg,
          });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        // Dado que el cálculo puede tomar mas tiempo y causar un time-out
        /*let msg =
          "Ha fallado la conexión con la API de cálculo de disponibilidad";
        this.setState({ log: { error: msg }, msg: msg });*/
        // console.log(error);
      });
    this._filter_reports(this.state.search);
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
            <Form.Group as={Row} className="sc-search">
              <Form.Label column sm="3" className="sc-pick-menu">
                <DateRangeTime
                  last_month={true}
                  onPickerChange={this.handle_picker_change}
                ></DateRangeTime>
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

              <Col sm="4" className="sc-search-input">
                <Form.Control
                  type="text"
                  onBlur={this._update_search}
                  onChange={this._filter_reports}
                  placeholder="Nodo a buscar"
                  disabled={this.state.calculating}
                />
              </Col>
              <Col className="sc-search-input">
                <Button
                  variant="outline-success"
                  onClick={this._download_excel_report}
                  disabled={this.state.loading || this.state.calculating}
                  className="donwload_excel"
                  data-tip={SRM_API_URL + "/sRemoto/disponibilidad/json/" + this._range_time()}
                >
                <FontAwesomeIcon  icon={faFileExcel} size="lg" /> {" "}
                Descargar
                </Button>
                <ReactTooltip />
              </Col>
              <div className="sc-body-cal">
                <Button
                  variant="outline-light"
                  className={
                    this.state.loading || this.state.calculating
                      ? "btn-cal-disp btn-dis"
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
                      ? "btn-cal-disp btn-dis"
                      : "btn-cal-disp"
                  }
                  onClick={() => this._cal_all("PUT")}
                >
                  <FontAwesomeIcon inverse icon={faPenFancy} size="lg" />{" "}
                  RE-ESCRIBIR CÁLCULO
                </Button>
                <div
                  className={
                    this.state.loading || this.state.calculating
                      ? "btn-cal-disp btn-dis"
                      : "btn-cal-disp"
                  }
                >
                  <Button
                    className={
                      this.state.loading || this.state.calculating
                        ? "btn-download-report btn-dis"
                        : "btn-download-report"
                    }
                    variant="outline-light"
                    onClick={this._download_tag_report}
                  >
                    <FontAwesomeIcon inverse icon={faTag} size="lg" />{" "}
                    REPORTE TAGS
                  </Button>
                  <input
                    type="text"
                    onChange={this._updateUmbral}
                    className="input-report"
                    data-tip="Ingrese el umbral de indisponibilidad mínima a reportar"
                  ></input>
                </div>
                <ReactTooltip />
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
                    onFinish={this.handle_finish_calculation}
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
