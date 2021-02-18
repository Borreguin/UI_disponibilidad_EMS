import * as React from "react";
import { BlockNodeModel } from "./BlockNodeModel";
import {
  DefaultPortLabel,
  DiagramEngine,
  PortModelAlignment,
  PortWidget,
} from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import "./BlockNodeStyle.css";
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

export interface BlockWidgetProps {
  node: BlockNodeModel;
  engine: DiagramEngine;
  size?: number;
}

/**
 * @author Roberto Sánchez
 * this: es el contenido de un nodo, este tiene los atributos:
 * 	entidades: 	son los puertos que se van a implementar dentro del nodo
 * 	editado; 	indica si el nodo ha sido editado
 * 	node: 		contiene los datos del nodo (nombre, tipo, etc)
 * 	size: 		tamaño del nodo
 */
export class BlockWidget extends React.Component<BlockWidgetProps> {
  bck_node: BlockNodeModel; // original node
  node: BlockNodeModel; // edited node
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

  _entityCallback = () => {};

  /*_update_entidad_activado = (p: string) => {
    this.node.data.entidades.forEach((entidad) => {
      if (entidad.entidad_nombre === p) {
        entidad.activado = !entidad.activado;
      }
    });
    this.is_edited();
  };*/

  /* _eliminar_entidad = async (p: string) => {
    console.log("inicio", this.node.data.entidades);
    const new_ents = [];
    const confirm = window.confirm("Seguro que desea eliminar este elemento?");
    if (confirm) {
      this.node.data.entidades.forEach((entidad) => {
        if (entidad.entidad_nombre !== p) {
          new_ents.push(entidad);
        }
      });
      this.node.data.entidades = new_ents;
    }
    this.is_edited();
  };*/

  generateNextPort = (port) => {
    return <div model={port} key={port.id} />;
  };

  /* _addElement = () => {
    let newH = Object.assign([], this.props.node.data.entidades);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    newH.push({
      entidad_nombre: "nueva entidad",
      entidad_tipo: "no definido",
      id: next_id,
      n_tags: 0,
      utrs: 0,
      activado: false,
    });
    console.log(newH, next_id);
    this.setState({
      entidades: newH,
    });
    // console.log("ADD next port", newH, this.props.node.data.entidades);
    this.props.node.addPort(new SerialOutPortModel(PortModelAlignment.TOP));
    // this.props.node.addNextPort("Nxt");
  };*/

  _updateNombre = (e) => {
    this.node.data.nombre = e.target.value.trim();
    this.is_edited();
    this.props.node.setLocked(false);
  };

  _update_activo = () => {
    this.node.data.activado = !this.node.data.activado;
    this.is_edited();
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

  test = () => {
    console.log(this.bck_node);
  };

  generatePort(port) {
    return <DefaultPortLabel port={port} engine={this.props.engine} />;
  }

  /* Generación del título del nodo */
  generateTitle(node) {
    return (
      <div>
        <div className="sr-node-title">{node.data.nombre}</div>
        <div className="BtnContainer">
          <FontAwesomeIcon
            icon={this.node.data.activado ? faCheck : faSave}
            size="2x"
            className={this.node.data.activado ? "icon-on" : "icon-off"}
            onClick={this._update_activo}
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
          <span className="badge badge-warning">InPut</span>
        </div>
        <div className="out-serial-port" key={_.uniqueId("SerialOutPort")}>
          <span className="badge badge-warning">SerialOut</span>
          <PortWidget
            className="SerialOutPort"
            port={this.props.node.getPort("SerialOutPut")}
            engine={this.props.engine}
          ></PortWidget>
        </div>
      </div>
    );
  };

  /* Generando puerto en paralelo */
  generateParallelPort = () => {
    return this.node.data.parallel_connections.map((parallelPort) => (
      <div key={_.uniqueId("ParallelPort")} className="Port-Container">
        <button className="widget-delete">-</button>
			<div className="ParallelLabel">{parallelPort.nombre}</div>
        <PortWidget
          className="ParallelPort"
          port={this.props.node.getPort(parallelPort.public_id)}
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
        <div className="sr-node">
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}
          
            <button className="widget-add" /*onClick={this._addElement}*/>
              +
            </button>
          
          {this.generateParallelPort()}
        </div>
      </div>
    );
  }
}

function name_format(name: string) {
  const n = 9;
  if (name.length > n) {
    name = name.toUpperCase().substring(0, n) + ".";
  } else {
    name = name.toUpperCase() + ".".repeat(n - name.length) + ".";
  }
  return name;
}
