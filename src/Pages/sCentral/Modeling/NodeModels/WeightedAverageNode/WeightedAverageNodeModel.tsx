import {
  NodeModel,
  NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
//import { NextPortModel } from '../../helpers/NextPortModel'
//import { NextPortLabel } from '../../helpers/NextPortLabelWidget'
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { WeightedAverageOutPortModel as WeightedAverageOutPortModel } from "./WeightedAverageOutputPort";
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

export type WeightedAverageNode = {
  name: string,
  type: string,
  editado: boolean,
  public_id: string,
  parent_id?: string,
  posx: number,
  posy: number,
  average_connections: Array<WeightedAverageNode>,
  serial_connection: WeightedAverageNode | undefined,
};

export interface WeightedAverageNodeParams {
  PORT: SerialOutPortModel;
  node: WeightedAverageNode;
}

// Aquí se definen las funciones del nodo

export class WeightedAverageNodeModel extends NodeModel<
  WeightedAverageNodeParams & NodeModelGenerics
> {
  data: WeightedAverageNode;
  edited: boolean;
  valid: boolean;

  constructor(params: { node: any }) {
    super({ type: "WeightedAverageNode", id: params.node.public_id });
    this.data = params.node;
    this.addPort(new SerialOutPortModel("SerialOutPut"));
    this.addPort(new InPortModel("InPut"));

    this.data.average_connections.forEach((parallel) => {
      this.addPort(new WeightedAverageOutPortModel(parallel.public_id));
    });
      this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
  }
  
  // Permite validar que el elemento ha sido correctamente conectado
  validate = () => {
    let valid = true;
    for (var type_port in this.getPorts()) {
      // todos los nodos deben estar conectados 
      // a excepción del puerto SerialOutPut ya que es opcional
      if (type_port !== "SerialOutPut") {
        var port = this.getPorts()[type_port];
        valid = valid && Object.keys(port.links).length === 1;
      }
    }
    this.valid = valid;
  }

  performanceTune = () => {
    this.validate();
    return true;
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

  
}
