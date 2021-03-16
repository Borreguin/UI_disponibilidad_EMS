import * as React from "react";
import { BlockRootModel } from "./BlockRootModel";
import {
  DefaultPortLabel,
  DiagramEngine,
  PortModelAlignment,
  PortWidget,
} from "@projectstorm/react-diagrams";
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
import ReactTooltip from "react-tooltip";

export interface BlockWidgetProps {
  node: BlockRootModel;
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

export class BlockRootWidget extends React.Component<BlockWidgetProps> {
  bck_node: BlockRootModel; // original node
  node: BlockRootModel; // edited node
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

  _update_node = () => {
    this.node.data.editado = !this.node.data.editado;
    //this.is_edited();
    // actualizar posición del nodo
    this.node.updatePosition();
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