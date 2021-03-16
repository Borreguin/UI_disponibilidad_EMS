import {
  NodeModel,
  NodeModelGenerics,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import { SRPortModel } from "../../../../../components/Diagrams/Nodes/SRNode/SRPortModel";
import { static_menu } from "../../../../../components/SideBars/menu_type";
import { bloqueleaf } from "../../../types";
import { SerialOutPortModel } from "./SerialOutputPort";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
//import { NextPortModel } from '../../helpers/NextPortModel'
//import { NextPortLabel } from '../../helpers/NextPortLabelWidget'
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { ParallelOutPortModel } from "./ParallelOutputPort";
import { SCT_API_URL } from "../../../Constantes";
/*
    ---- Define el modelo del nodo (Leaf Block) ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type Node = {
  name: string,
  type: string,
  editado: boolean,
  public_id: string,
  parent_id?: string,
  posx: number,
  posy: number,
  parallel_connections: Array<Node>,
  serial_connection: Node | undefined,
};

export interface BlockNodeParams {
  PORT: SerialOutPortModel;
  node: Node;
}

// Aquí se definen las funciones del nodo

export class BlockNodeModel extends NodeModel<
  BlockNodeParams & NodeModelGenerics
> {
  data: Node;
  edited: boolean;

  constructor(params: { node: any }) {
    super({ type: "BlockNode", id: params.node.public_id });
    this.data = params.node;
    this.addPort(new SerialOutPortModel("SerialOutPut"));
    this.addPort(new InPortModel("InPut"));

    this.data.parallel_connections.forEach((parallel) => {
      this.addPort(new ParallelOutPortModel(parallel.public_id));
    });
      this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
  }
  
  
  updatePosition = () => {
    let path = SCT_API_URL + "/block-leaf/block-root/" + this.data.parent_id + "/block-leaf/" + this.data.public_id + "/position";
    let body = {pos_x: this.getPosition().x, pos_y: this.getPosition().y};
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json())
    .then((json) => {
      console.log(json);
    })
    .catch(console.log);
  };




  setNodeInfo(_node: Node) {
    this.data = _node;
  }

  addNextPort(label: any) {
    this.addPort(new SRPortModel(PortModelAlignment.RIGHT));
  }

  generateNextPort = (port) => {
    this.addPort(new SRPortModel(PortModelAlignment.RIGHT));
  };

  addInPort(label) {
    return this.addPort(
      new DefaultPortModel(true, _.uniqueId("InPort"), label)
    );
  }
  addOutPort(label) {
    return this.addPort(
      new DefaultPortModel(false, _.uniqueId("OutPort"), label)
    );
  }
  getInPorts() {
    return _.filter(this.ports, (portModel) => {
      return portModel.in;
    });
  }
  getOutPorts() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.in;
    });
  }
}
