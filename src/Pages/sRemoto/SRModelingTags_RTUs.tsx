import React, { Component } from "react";
import "./styles.css";
import { Tab, Form, Col, Tabs, Button, Alert } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { UTR } from "./SRNode";

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
};

class SRModelingRTU extends Component<
  SRModelingTagsRTUProps,
  SRModelingRTUState
> {
    options: Array<any>;
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
      options:[],
      };
  }

    componentDidMount = () => {
        this._get_utrs();
  };

    _rtu_options = () => { 
        let options = [];
        this.state.utrs.forEach((utr, ix) => { 
            options.push(<option key={ix}>{utr.id_utr}</option>);
        })
        console.log(options);
        this.setState({options:options})
    }  
    
  _get_utrs = async() => {
    let path =
      "/api/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
          if (json.success) {
              this.setState({utrs:json.utrs})
          }
          this._rtu_options();
      })
      .catch(console.log);
  };

  _check_rtu_form = () => {
    let fields = ["id_utr", "tipo", "nombre"];
    let valid = true;
    fields.forEach((f) => {
      valid = valid && this.state.utr_form[f].length > 3;
    });
    this.setState({ utr_valid: valid });
  };

  _handle_rtu_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  _send_rtu_form = () => {
    this.setState({ success: false, msg: "" });
    let path =
      "/api/admin-sRemoto/rtu/" +
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

        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

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
            <Form.Check defaultChecked type="checkbox" label="Activada" />
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

  _render_edit_rtu_form = () => {
    return (
      <Form className="tab-container">
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>Id UTR</Form.Label>
            <Form.Control as="select" placeholder="Seleccione ID">
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
            <Form.Check defaultChecked type="checkbox" label="Activada" />
          </Form.Group>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-warning"
              style={{ float: "right" }}
              disabled={!this.state.utr_valid}
              data-tip={
                "<div>Presione aquí para editar la UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._send_rtu_form}
            >
              {"Editar UTR en " + this.props.selected.entidad_nombre}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

    _update_utr = () => {
        console.log("me");
        this._get_utrs()
        return <div></div>;
    }
  render() {
    return (
        <div className="tab-container">
            {this._update_utr}
        <Tabs
          defaultActiveKey="dt-create-utr"
          id="un-tab-mod"
          transition={false}
        >
          <Tab eventKey="dt-create-utr" title="Crear">
            {this._render_create_rtu_form()}
          </Tab>
                <Tab eventKey="dt-editar-utr" title={"Editar"}>
            {this._render_edit_rtu_form()}
          </Tab>
          <Tab eventKey="dt-eliminar-utr" title="Eliminar"></Tab>
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
