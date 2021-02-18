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
/*
    ---- Define el modelo del nodo (Leaf Block) ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/
export type Parallel = {
  nombre: string;
  public_id: string;
};

export type Node = {
  nombre: string;
  activado: boolean;
  public_id: string;
  parallel_connections: Array<Parallel>;
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

    this.edited = false;
  }

  updateNombre = (e) => {
    const in_text = e.target.value;
    if (this.data.nombre !== in_text && in_text.length > 1) {
      this.data.nombre = in_text.trim();
      this.edited = true;
    }
    this.setLocked(false);
  };

  updateActivo = () => {
    console.log("check", this.data.activado);
    this.data.activado = !this.data.activado;
    this.edited = true;
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
