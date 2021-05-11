import * as React from "react";
import { WeightedNodeModel } from "./WeightedNodeModel";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
import "./WeightedNodeStyle.css";
import { faSave, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import { WeightedOutPortModel } from "./WeightedOutputPort";

export interface WeightedNodeWidgetProps {
  node: WeightedNodeModel;
  engine: DiagramEngine;
  size?: number;
  handle_messages?: Function;
}

/**
 * @author Roberto Sánchez
 * this: es el contenido de un nodo, este tiene los atributos:
 * 	bck_node: 	los atributos del nodo original
 * 	node; 	    los tributos cambiados del nodo si se requiere
 */

export class WeightedNodeWidget extends React.Component<WeightedNodeWidgetProps> {
  bck_node: WeightedNodeModel; // original node
  node: WeightedNodeModel; // edited node
  state = {
    edited: false,
    weight: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      weight: {},
    };
    this.node = _.cloneDeep(props.node);
    this.bck_node = _.cloneDeep(props.node);
  }

  _handle_message(msg: Object) {
    if (this.props.handle_messages !== undefined) {
      this.props.handle_messages(msg);
    }
  }

  _addWeightedPort = () => {
    // making a backup of the last node:
    this.bck_node = _.cloneDeep(this.node);
    // añadiendo puerto:
    var resp = this.node.addWeightedPort();
    this.node.data = resp.data;
    // actualizando estado de editado
    this.is_edited();
    this.props.engine.repaintCanvas();
  };

  _deleteWeightedPort = (id_port) => {
    // identificando si es posible eliminar el puerto:
    if (Object.keys(this.props.node.getPorts()).length <= 4) {
      let msg = { msg: "No se puede eliminar este puerto" };
      this._handle_message(msg);
      let port = this.props.node.getPort(id_port);
      this._disconnect_port(port);
      return;
    }
    // eliminando el puerto y links
    var resp = this.node.deleteWeightedPort(id_port);
    this.node.data = resp.data;
    this.is_edited();
    this.props.engine.repaintCanvas();
  };

  _disconnect_port = (port) => {
    var links = port.getLinks();
    for (var link in links) {
      this.props.node.getLink(link).remove();
    }
    this.is_edited();
    let msg = { msg: "Se ha realizado la desconexión" };
    this._handle_message(msg);
    // actualizando el Canvas
    this.props.engine.repaintCanvas();
  };

  _update_node = () => {
    this.node.data.editado = !this.node.data.editado;
    // crear si no existe:
    if (!this.node.create_if_not_exist()) {
      // actualizar posición del nodo
      this.node.updatePosition();
    }
    
    this.props.engine.repaintCanvas();
  };

  _delete_node = () => {
    this.node.data.editado = !this.node.data.editado;
    let node = this.props.engine.getModel().getNode(this.node.getID());
    let ports = node.getPorts();
    for (var p in ports) {
      let port = ports[p];
      let links = port.getLinks();
      for (var id_l in links) {
        let link = links[id_l];
        this.props.node.getLink(id_l).remove();
        this.props.engine.getModel().removeLink(link);
      }
    }
    this.node.delete();
    this.props.engine.getModel().removeNode(node);
    this.props.engine.repaintCanvas();
  };

  is_edited = () => {
    if (_.isEqual(this.bck_node, this.node)) {
      this.setState({ edited: false });
    } else {
      this.setState({ edited: true });
    }
  };

  hasChanged = (old_word: string, new_word: string) => {
    if (old_word !== new_word && new_word.length > 3) {
      this.setState({ edited: true });
      return true;
    } else {
      this.setState({ edited: false });
      return false;
    }
  };

  /* Generación del título del nodo */
  generateTitle(node) {
    return (
      <div>
        <div data-tip={node.data.name} className="sr-node-title">
          {node.data.name}
        </div>
        <ReactTooltip />
        <div className="BtnContainer">
          {/* Permite eliminar el elemento*/}
          <FontAwesomeIcon
            icon={faTrash}
            size="2x"
            className="removeIcon"
            onClick={this._delete_node}
          />
          {/* Permite guardar en base de datos la posición del elemento */}
          <FontAwesomeIcon
            icon={this.node.data.editado ? faCheck : faSave}
            size="2x"
            className={this.node.data.editado ? "icon-on" : "icon-off"}
            onClick={this._update_node}
          />
        </div>
      </div>
    );
  }

  /*Generación del puerto de entrada (inport) y conexión de salida de serial (SERIE) */
  generateInAndOutSerialPort = () => {
    return (
      <div className="Port-Container">
        <div className="in-port" key={_.uniqueId("InPort")}>
          <PortWidget
            className="InPort"
            port={this.props.node.getPort("InPut")}
            engine={this.props.engine}
          ></PortWidget>
          <button
            data-tip="Desconectar este puerto"
            className="widget-delete"
            onClick={() =>
              this._disconnect_port(this.props.node.getPort("InPut"))
            }
          >
            -
          </button>
          <ReactTooltip />
          <span className="badge badge-warning badge-space">InPut</span>
        </div>
        <div className="out-serial-port" key={_.uniqueId("SERIEPort")}>
          <span className="badge badge-warning badge-space">SerOut</span>
          <PortWidget
            className="SerialOutPort"
            port={this.props.node.getPort("SERIE")}
            engine={this.props.engine}
          ></PortWidget>
          <button
            data-tip="Desconectar este puerto"
            className="widget-delete"
            onClick={() =>
              this._disconnect_port(this.props.node.getPort("SERIE"))
            }
          >
            .
          </button>
          <ReactTooltip />
        </div>
      </div>
    );
  };

  _on_weighted_change = (event, public_id: string) => {
    var value = event.target.value;
    let weight = this.state.weight;
    weight[public_id] = value;
    this.setState({ weight: weight });
  };

  _validate_weighted_change = () => {
    this.props.node.setLocked(false);
    let weightedPorts = this.node.get_weighted_ports();
    let weight = this.state.weight;
    let acc = 100;
    let last_port = null;
    let last_value = 0;
    weightedPorts.forEach((port) => {
      let port_name = port.getName();
      if (weight[port_name] === undefined) {
        weight[port_name] = 0;
      }
      acc -= weight[port_name];
      if (acc < 0) {
        weight[port_name] = 0;
      }
      last_port = port_name;
      last_value = weight[port_name];
    });
    if (last_port !== null && acc > 0) {
      weight[last_port] = ((acc + last_value).toFixed(2)).toString();
    }
    this.setState({ weight: weight });
  };

  /* Generando puertos con ponderación */
  generateWeightedPort = () => {
    return this.node.data.connections.map((port) => (
      <div id={port.public_id} key={port.public_id} className="Port-Container">
        <button
          data-tip="Remover este puerto"
          className="widget-delete"
          onClick={() => this._deleteWeightedPort(port.public_id)}
        >
          -
        </button>
        <ReactTooltip />
        <div id={port.public_id} key={port.public_id} className="ParallelLabel">
          <input
            type="number"
            step="0.000001"
            min="0"
            className="input-style"
            value={this.state.weight[port.public_id] || 0}
            onChange={(e) => this._on_weighted_change(e, port.public_id)}
            onFocus={() => {
              this.props.node.setLocked(true);
            }}
            onBlur={this._validate_weighted_change}
          ></input>
          <span className="badge badge-warning right">WeigtOut</span>
        </div>

        <PortWidget
          className="WeightedPort"
          port={this.props.node.getPort(port.public_id)}
          engine={this.props.engine}
        ></PortWidget>
      </div>
    ));
  };

  // Esta sección define la vista/diseño de cada nodo
  // Widget
  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    const { node } = this.props;
    return (
      <div
        className="node css-nlpftr"
        onClick={() => {
          this.props.node.setSelected(true);
        }}
        key={this.props.node.getID()}
      >
        <div
          className={
            this.props.node.valid ? "sr-weigthed" : "sr-weigthed in_error"
          }
        >
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}

          <button className="widget-add" onClick={this._addWeightedPort}>
            +
          </button>

          {this.generateWeightedPort()}
        </div>
      </div>
    );
  }
}
