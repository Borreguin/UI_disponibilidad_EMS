import React, { Component } from "react";
import "../styles.css";
import {
  Tab,
  Form,
  Col,
  Tabs,
  Button,
  Alert,
  Card,
  CardGroup,
} from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { UTR } from "../SRNode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { SRM_API_URL } from "../Constantes";

type Selected = {
  entidad_tipo: string;
  entidad_nombre: string;
};

type SelectedID = {
  nodo: string;
  entidad: string;
};

type SRModelingTagsRTUProps = {
  selected: Selected;
  selected_id: SelectedID;
};

type SRModelingRTUState = {
  utr_valid: boolean;
  utr_form: Object;
  success: boolean;
  msg: string;
  utrs: Array<UTR>;
  options: Array<any>;
  edited_utr_valid: boolean;
  edited_utr: UTR;
  loading: boolean;
};

class SRModelingRTU extends Component<
  SRModelingTagsRTUProps,
  SRModelingRTUState
> {
  selected_entity: string;
  constructor(props) {
    super(props);
    this.state = {
      utr_valid: false,
      utr_form: {
        id_utr: "",
        tipo: "",
        nombre: "",
        activado: true,
      },
      success: false,
      msg: "",
      utrs: [],
      options: [],
      edited_utr_valid: false,
      edited_utr: {
        activado: true,
        utr_tipo: "",
        utr_nombre: "",
        id_utr: "",
        utr_code: "",
      },
      loading: false,
    };
    this.selected_entity = "";
  }

  componentDidMount = () => {
    this._get_utrs();
  };

  componentDidUpdate() {
    // actualizando el controlador de selección de UTRs
    if (this.selected_entity !== this.props.selected.entidad_nombre) {
      this.setState({
        options: [<option key={0}>Cargando...</option>],
        utrs: [],
      });
      this._get_utrs();
      this.selected_entity = this.props.selected.entidad_nombre;
    }
  }

  _rtu_options = () => {
    let options = [];
    this.state.utrs.forEach((utr, ix) => {
      options.push(<option key={ix}>{utr.id_utr}</option>);
    });
    this.setState({ options: options });
  };

  _get_utrs = async () => {
    let path =
      SRM_API_URL + "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({ utrs: json.utrs });
        }
        this._rtu_options();
      })
      .catch(console.log);
  };

  _handle_rtu_select = (e) => {
    let id_utr = e.target.value;
    let selected_utr = this.state.edited_utr;
    this.state.utrs.forEach((_rtu) => {
      if (_rtu.id_utr === id_utr) {
        selected_utr.id_utr = _rtu.id_utr;
        selected_utr.utr_nombre = _rtu.utr_nombre;
        selected_utr.utr_tipo = _rtu.utr_tipo;
        selected_utr.activado = _rtu.activado;
        this.setState({ edited_utr: selected_utr });
      }
    });
  };

  _check_rtu_form = () => {
    let fields = ["id_utr", "tipo", "nombre"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.utr_form[f] !== undefined &&
        this.state.utr_form[f].length > 3;
    });
    this.setState({ utr_valid: valid });
  };

  _check_edited_rtu_form = () => {
    let fields = ["utr_tipo", "utr_nombre"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.edited_utr[f] !== undefined &&
        this.state.edited_utr[f].length > 3;
    });
    this.setState({ edited_utr_valid: valid });
  };

  _handle_rtu_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  _edit_rtu_form_changes = (e, field) => {
    let rtu_form = this.state.edited_utr;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_edited_rtu_form();
  };

  _delete_rtu = (id_utr) => {
    this.setState({ loading: true, msg: "Procesando..." });
    let path =
      SRM_API_URL + "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;

    fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_utr: id_utr }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({ utrs: json.utrs });
        }
        this._rtu_options();
        this.setState({ loading: false, success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _send_rtu_form = () => {
    this.setState({ success: false, msg: "" });
    console.log(this.state.utr_form);
    let path =
      SRM_API_URL + "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.utr_form),
    })
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.entidad_tipo +
          " " +
          this.props.selected.entidad_nombre +
          " " +
          json.msg;
        this._get_utrs();
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _send_edit_rtu_form = () => {
    let form = this.state.utr_form;
    form["id_utr"] = this.state.edited_utr.id_utr;
    form["tipo"] = this.state.edited_utr.utr_tipo;
    form["nombre"] = this.state.edited_utr.utr_nombre;
    form["activado"] = this.state.edited_utr.activado;
    this.setState({ utr_form: form });
    this._send_rtu_form();
  };

  // forma para crear RTUs
  _render_create_rtu_form = () => {
    return (
      <Form className="tab-container">
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Id UTR
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese Id"
              onChange={(e) => this._handle_rtu_form_changes(e, "id_utr")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Tipo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese tipo"
              onChange={(e) => this._handle_rtu_form_changes(e, "tipo")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Nombre
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              onChange={(e) => this._handle_rtu_form_changes(e, "nombre")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Form.Check
              defaultChecked
              type="checkbox"
              label="Activada"
              onChange={(e) => {
                let utr_form = this.state.utr_form;
                utr_form["activado"] = !utr_form["activado"];
                this.setState({ utr_form: utr_form });
                this._check_rtu_form();
              }}
            />
          </Form.Group>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-success"
              style={{ float: "right" }}
              disabled={!this.state.utr_valid}
              data-tip={
                "<div>Presione aquí para crear una nueva UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._send_rtu_form}
            >
              {"Crear UTR en " + this.props.selected.entidad_nombre}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

  // forma para editar RTUs
  _render_edit_rtu_form = () => {
    return (
      <Form className="tab-container">
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>Id UTR</Form.Label>
            <Form.Control
              as="select"
              placeholder="Seleccione ID"
              onChange={this._handle_rtu_select}
            >
              {this.state.options}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Tipo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese tipo"
              value={this.state.edited_utr.utr_tipo}
              onChange={(e) => this._edit_rtu_form_changes(e, "utr_tipo")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Nombre
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={this.state.edited_utr.utr_nombre}
              onChange={(e) => this._edit_rtu_form_changes(e, "utr_nombre")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Form.Check
              type="checkbox"
              label="Activada"
              checked={this.state.edited_utr.activado}
              onChange={(e) => {
                let edited_utr = this.state.edited_utr;
                edited_utr.activado = !edited_utr.activado;
                this.setState({ edited_utr: edited_utr });
                this._check_edited_rtu_form();
              }}
            />
          </Form.Group>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-primary"
              style={{ float: "right" }}
              disabled={!this.state.edited_utr_valid}
              data-tip={
                "<div>Presione aquí para editar la UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._send_edit_rtu_form}
            >
              {"Editar UTR en " + this.props.selected.entidad_nombre}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

  // forma para eliminar RTUs
  _render_delete_rtu_form = () => {
    let utrs = [];
    if (this.state.utrs === undefined) {
      return;
    }
    this.state.utrs.forEach((utr, ix) => {
      utrs.push(
        <Card.Header key={ix} className="utr-block">
          <Button
            variant="outline-light"
            className={
              this.state.loading
                ? "src-btn-right src-btn-disabled"
                : "src-btn-right scr-btn-trash"
            }
            onClick={() => this._delete_rtu(utr.id_utr)}
          >
            <FontAwesomeIcon icon={faTrash} inverse size="sm" />
          </Button>
          <div className="utr-label">{utr.utr_tipo}</div>
          <div className="utr-label">
            <b>{utr.utr_nombre}</b>
          </div>
        </Card.Header>
      );
    });
    return <CardGroup className="tab-container">{utrs}</CardGroup>;
  };

  render() {
    return (
      <div className="tab-container">
        <Tabs
          defaultActiveKey="dt-editar-utr"
          id="un-tab-mod"
          transition={false}
        >
          <Tab eventKey="dt-create-utr" title="Crear UTR">
            {this._render_create_rtu_form()}
          </Tab>
          <Tab eventKey="dt-editar-utr" title={"Editar UTR"}>
            {this._render_edit_rtu_form()}
          </Tab>
          <Tab eventKey="dt-eliminar-utr" title="Eliminar UTR">
            {this._render_delete_rtu_form()}
          </Tab>
        </Tabs>
        {this.state.msg.length === 0 ? (
          <></>
        ) : (
          <Alert variant={this.state.success ? "success" : "warning"}>
            {this.state.msg}
          </Alert>
        )}
      </div>
    );
  }
}
export default SRModelingRTU;
