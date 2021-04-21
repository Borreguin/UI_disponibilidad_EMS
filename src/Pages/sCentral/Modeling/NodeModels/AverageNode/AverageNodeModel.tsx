import {
  NodeModel,
  NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { AverageOutPortModel as AverageOutPortModel } from "./AverageOutputPort";
import { SCT_API_URL } from "../../../Constantes";
/*
    ---- Define el modelo del nodo (Average Block) ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type PortData = {
  name: string;
  public_id: string;
};

export type AverageNode = {
  public_id: string;
  name: string;
  type: string;
  editado: boolean;
  parent_id?: string;
  posx: number;
  posy: number;
  connections: Array<PortData>;
  serial_connection: PortData | undefined;
};

export interface AverageNodeParams {
  PORT: SerialOutPortModel;
  node: AverageNode;
}

// Aquí se definen las funciones del nodo

export class AverageNodeModel extends NodeModel<
  AverageNodeParams & NodeModelGenerics
> {
  data: AverageNode;
  edited: boolean;
  valid: boolean;

  constructor(params: { node: any }) {
    super({ type: "AverageNode", id: params.node.public_id });
    this.data = params.node;
    this.addPort(new SerialOutPortModel("SerialOutPut"));
    this.addPort(new InPortModel("InPut"));

    this.data.connections.forEach((parallel) => {
      this.addPort(new AverageOutPortModel(parallel.public_id));
    });
    this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
  }

  // TODO: actualizar mensajes al finalizar
  updateBlock = () => {
    let ports = this.getPorts();
    let operator_ids = [];
    for (var id_port in ports) {
      let port = ports[id_port];
      if (port.getType() === "AverageOutputPort") {
        let links = port.getLinks();
        for (var id_link in links) {
          let link = links[id_link];
          let sPort = link.getSourcePort();
          let tPort = link.getTargetPort();
          if (sPort.getType() === "InPort") {
            operator_ids.push(sPort.getParent().getID());
          } else {
            operator_ids.push(tPort.getParent().getID());
          }
        }
      }
    }
    let operation = {
      public_id: this.data.public_id,
      name: this.data.name,
      type: this.data.type,
      operator_ids: operator_ids,
      position_x_y: [this.getPosition().x, this.getPosition().y],
    };

    let path =
      SCT_API_URL + "/block-root/" + this.data.parent_id + "/operation";
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(operation),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      })
      .catch(console.log);
    // TODO: update result in graph
  };

  // TODO: actualizar mensaje
  delete = () => {
    let path = SCT_API_URL + "/block-root/" + this.data.parent_id + "/operation/" + this.data.public_id;
    fetch(path, { method: "DELETE", headers: { "Content-Type": "application/json" } })
      .then((res) => res.json())
      .then((json) => { console.log(json) });
  };

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
  };

  performanceTune = () => {
    this.validate();
    return true;
  };

  setNodeInfo(data: AverageNode) {
    this.data = data;
  }

  addAveragePort = () => {
    let newH = Object.assign([], this.data.connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    let p_port = {
      name: "",
      public_id: "PAverage_" + this.data.public_id + "_" + next_id,
    };
    newH.push(p_port);
    // edititing the node:
    this.data.connections = newH;
    this.addPort(new AverageOutPortModel(p_port.public_id));
    return { data: this.data };
  };

  deleteAveragePort = (id_port) => {
    let newH = [];
    // eliminando los links conectados a este puerto
    var port = this.getPort(id_port);
    var links = this.getPort(id_port).getLinks();
    for (var link in links) {
      this.getLink(link).remove();
    }
    // removiendo el puerto
    this.removePort(port);
    // actualizando la metadata del nodo:
    this.data.connections.forEach((port) => {
      if (port.public_id !== id_port) {
        newH.push(port);
      }
    });
    // edititing the node:
    this.data.connections = newH;
    return { data: this.data };
  };
}
