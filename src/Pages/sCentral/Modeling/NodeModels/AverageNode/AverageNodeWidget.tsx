import * as React from "react";
import { AverageNodeModel } from "./AverageNodeModel";
import {
  DefaultPortLabel,
  DiagramEngine,
  PortModelAlignment,
  PortWidget,
} from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import "./AverageNodeStyle.css";
import {
  faTrash,
  faSave,
  faToggleOn,
  faToggleOff,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { AverageOutPortModel as AverageOutPortModel } from "./AverageOutputPort";

export interface AverageNodeWidgetProps {
  node: AverageNodeModel;
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

export class AverageNodeWidget extends React.Component<AverageNodeWidgetProps> {
  bck_node: AverageNodeModel; // original node
  node: AverageNodeModel; // edited node
  state = {
    edited: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      edited: false,
    };
    this.node = _.cloneDeep(props.node);
    this.bck_node = _.cloneDeep(props.node);
  }

  _handle_message(msg: Object) {
    if (this.props.handle_messages !== undefined) {
      this.props.handle_messages(msg);
    }
  }

  _addAveragePort = () => {
    let newH = Object.assign([], this.node.data.average_connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    let p_port = {
      nombre: "Sin conexión",
      public_id: "PAverage_" + this.node.data.public_id + "_" + next_id,
    };
    newH.push(p_port);
    // making a backup of the last node:
    this.bck_node = _.cloneDeep(this.node);
    // edititing the node:
    this.node.data.average_connections = newH;
    this.props.node.addPort(new AverageOutPortModel(p_port.public_id));
    this.is_edited();
  };

  _deleteAveragePort = (id_port) => {
    // lista nueva de puertos
    let newH = [];
    // identificando el puerto a eliminar
    var port = this.props.node.getPort(id_port);
    // eliminando los links conectados a este puerto
    var links = this.props.node.getPort(id_port).getLinks();
    for (var link in links) {
      this.props.node.getLink(link).remove();
    }
    // removiendo el puerto
    this.props.node.removePort(port);
    // actualizando la metadata del nodo:
    this.node.data.average_connections.forEach((port) => {
      if (port.public_id !== id_port) {
        newH.push(port);
      }
    });
    this.node.data.average_connections = newH;
    // cambiando el estado de editado:
    this.is_edited();
    let msg = { msg: "Se ha eliminado el puerto" };
    this._handle_message(msg);
    // actualizando el Canvas
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
  }

  _update_node = () => {
    this.node.data.editado = !this.node.data.editado;
    //this.is_edited();
    // actualizar posición del nodo
    this.node.updatePosition();
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

  /*Generación del puerto de entrada (inport) y conexión de salida de serial (SerialOutPut) */
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
            onClick={() => this._disconnect_port(this.props.node.getPort("InPut"))}
          >
            -
          </button>
          <ReactTooltip />
          <span className="badge badge-warning badge-space">InPut</span>
        </div>
        <div className="out-serial-port" key={_.uniqueId("SerialOutputPort")}>
          <span className="badge badge-warning badge-space">SerOut</span>
          <PortWidget
            className="SerialOutPort"
            port={this.props.node.getPort("SerialOutPut")}
            engine={this.props.engine}
          ></PortWidget>
          <button
            data-tip="Desconectar este puerto"
            className="widget-delete"
            onClick={() => this._disconnect_port(this.props.node.getPort("SerialOutPut"))}
          >
            .
          </button>
          <ReactTooltip />
        </div>
      </div>
    );
  };

  /* Generando puerto en paralelo */
  generateAveragePort = () => {
    return this.node.data.average_connections.map((averagePort) => (
      <div key={_.uniqueId("AveragePort")} className="Port-Container">
        <button
          data-tip="Remover este puerto"
          className="widget-delete"
          onClick={() => this._deleteAveragePort(averagePort.public_id)}
        >
          -
        </button>
        <ReactTooltip />
        <div className="ParallelLabel">
          {averagePort.name}{" "}
          <span className="badge badge-warning right">PromOut</span>
        </div>

        <PortWidget
          className="AveragePort"
          port={this.props.node.getPort(averagePort.public_id)}
          engine={this.props.engine}
        ></PortWidget>
      </div>
    ));
  };

  // Esta sección define la vista/diseño de cada nodo
  // Widget
  render() {
    const { node } = this.props;
    return (
      <div
        className="node css-nlpftr"
        onClick={() => {
          this.props.node.setSelected(true);
        }}
        key={this.props.node.getID()}
      >
        <div className="sr-average">
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}

          <button className="widget-add" onClick={this._addAveragePort}>
            +
          </button>

          {this.generateAveragePort()}
        </div>
      </div>
    );
  }
}

