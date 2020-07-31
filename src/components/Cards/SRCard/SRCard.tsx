import React, { Component } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Node, Entity } from "./SRCardModel";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadNode from "./UploadNode";
import {
  faToggleOn,
  faToggleOff,
  faAngleDoubleDown,
  faAngleDoubleUp,
  faSave,
  faUndo,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./SRCard.css";
import { EntityCards } from "./EntityCards";

export interface SRCardProps {
  node: Node;
}

class SRCard extends Component<SRCardProps> {
  state = {
    open: false,
    edited: false,
    message: "",
    visible: false,
  };
  bck_node: Node; // original node
  lcl_node: Node; // edited node
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      open: false,
      message: "",
      visible: false,
    };
    this.lcl_node = _.cloneDeep(props.node);
    this.bck_node = _.cloneDeep(props.node);
  }

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    });
  };

  is_edited = () => {
    if (_.isEqual(this.bck_node, this.lcl_node)) {
      this.setState({ edited: false });
    } else {
      this.setState({ edited: true });
    }
  };
  // permite manejar los cambios ocurridos en el hijo:
  // new_entities viene desde el hijo como consecuencia
  // de un cambio
  handle_entities_change = (new_entities: Entity[]) => {
    this.lcl_node.entidades = new_entities;
    this.is_edited();
  };

  // permite indicar cuando un nodo has sido actualizado
  // mediante archivo
  handle_on_node_upload = (new_node) => {
    this.setState({ edited: true });
    this.lcl_node = _.cloneDeep(new_node);
    this.bck_node = _.cloneDeep(new_node);
    console.log(this.lcl_node);
    this.setState({ edited: false });
  };

  _updateNombre = (e, trim) => {
    if (trim) {
      this.lcl_node.nombre = e.target.value.trim();
    } else {
      this.lcl_node.nombre = e.target.value;
    }
    this.is_edited();
  };
  _updateTipo = (e, trim: boolean) => {
    if (trim) {
      this.lcl_node.tipo = e.target.value.trim();
    } else {
      this.lcl_node.tipo = e.target.value;
    }
    this.is_edited();
  };
  _update_activo = () => {
    this.lcl_node.activado = !this.lcl_node.activado;
    this.is_edited();
  };

  _reset_node = () => {
    this.lcl_node = _.cloneDeep(this.bck_node);
    this.is_edited();
  };

  _save_node = async () => {
    this.setState({ message: "Guardando en base de datos...", edited: false });
    this.onShowAlert();
    let path = "/api/admin-sRemoto/nodo/id/" + this.bck_node.id_node;
    await fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.lcl_node),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors !== undefined) {
          this.setState({ message: json.errors, edited: true });
          if (json.errors === "No se encontró el nodo") {
            this._create_new_node();
          }
        } else {
          this.bck_node = _.cloneDeep(json);
          this.is_edited();
          this.lcl_node = _.cloneDeep(json);
          this.setState({ message: "Guardado exitoso" });
        }
      })
      .catch(console.log);
    this.onShowAlert();
  };

  _create_new_node = async () => {
    this.setState({ message: "Creando nuevo nodo...", edited: false });
    let path = "/api/admin-sRemoto/nodo/id/" + this.bck_node.id_node;
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.lcl_node),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors !== undefined) {
          this.setState({
            message: json.errors,
            edited: true,
            visible: true,
          });
        } else {
          console.log("new node", json);
          this.bck_node = _.cloneDeep(json);
          this.is_edited();
          this.lcl_node = _.cloneDeep(json);
          this.setState({ message: "Guardado exitoso" });
        }
      })
      .catch(console.log);
  };

  _delete_node = async () => {
    const confirm = window.confirm(
      "Seguro que desea eliminar? " +
        this.bck_node.tipo +
        ": " +
        this.bck_node.nombre
    );
    if (confirm) {
      let path = "/api/admin-sRemoto/nodo/id/" + this.bck_node.id_node;
      await fetch(path, { method: "DELETE" })
        .then((res) => res.json())
        .then((json) => {
          if (json === null) {
          }
          this.bck_node = null;
          this.setState({ edited: true });
        })
        .catch(console.log);
    }
  };

  _download_node = () => {
    let url =
      "/api/admin-sRemoto/nodo/" +
      this.bck_node.tipo +
      "/" +
      this.bck_node.nombre +
      "/from-excel";
    let name = this.bck_node.tipo + this.bck_node.nombre + ".xlsx";
    fetch(url).then((response) => {
      if (!response.ok) return;
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
      });
    });
  };

  render() {
    if (this.bck_node === null) return <></>;
    return (
      <Card>
        <Card.Header
          onClick={(e) => {
            if (e.target.className === "card-header") {
              this.setState({ open: !this.state.open });
            }
          }}
        >
          <FontAwesomeIcon
            icon={this.state.open ? faAngleDoubleUp : faAngleDoubleDown}
            size="sm"
            className="toggle-btn"
            onClick={() => {
              this.setState({ open: !this.state.open });
            }}
          />
          <FontAwesomeIcon
            icon={this.lcl_node.activado ? faToggleOn : faToggleOff}
            inverse
            size="2x"
            className={this.lcl_node.activado ? "src-icon-on" : "src-icon-off"}
            onClick={this._update_activo}
          />
          <input
            value={this.lcl_node.tipo}
            type="text"
            onChange={(e) => this._updateTipo(e, false)}
            onBlur={(e) => this._updateTipo(e, true)}
            className="src-input"
          />
          <input
            value={this.lcl_node.nombre}
            type="text"
            onChange={(e) => this._updateNombre(e, false)}
            onBlur={(e) => this._updateNombre(e, true)}
            className="src-input"
          />
          <Button
            variant="outline-light"
            className={"src-btn-right scr-btn-trash"}
            onClick={this._delete_node}
          >
            <FontAwesomeIcon icon={faTrash} inverse size="sm" />
          </Button>
          <Button
            variant="outline-light"
            className={
              this.state.edited
                ? "src-btn-right src-btn-active"
                : "src-btn-right src-btn-disabled"
            }
            onClick={this._save_node}
          >
            <FontAwesomeIcon icon={faSave} inverse size="sm" />
          </Button>

          <Button
            variant="outline-light"
            className={
              this.state.edited
                ? "src-btn-right src-btn-active"
                : "src-btn-right src-btn-disabled"
            }
            onClick={this._reset_node}
          >
            <FontAwesomeIcon icon={faUndo} inverse size="sm" />
          </Button>

          <Button
            variant="outline-light"
            className={
              !this.state.edited
                ? "src-btn-right src-btn-active"
                : "src-btn-right src-btn-disabled"
            }
            onClick={this._download_node}
          >
            <FontAwesomeIcon icon={faDownload} inverse size="sm" />
          </Button>

          <Alert
            variant="light"
            show={this.state.visible}
            className="alert-msg"
          >
            {this.state.message}{" "}
          </Alert>
        </Card.Header>
        <Card.Body className={this.state.open ? "collapse show" : "collapse"}>
          <div className="file-seccion">
            <div className="tile-file-seccion"> Configurar desde archivo </div>
            <UploadNode
              node_name={this.bck_node.nombre}
              tipo={this.bck_node.tipo}
              onNodeUpload={this.handle_on_node_upload}
            ></UploadNode>
          </div>
          <div className="entity-seccion">
            {this.lcl_node.entidades === undefined ? (
              <></>
            ) : (
              <EntityCards
                entidades={this.lcl_node.entidades}
                onEntityChange={this.handle_entities_change}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default SRCard;
