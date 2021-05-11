import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { WeightedOutPortModel } from "./WeightedOutputPort";
import { SCT_API_URL } from "../../../Constantes";
import { common_get_node_connected_serie, common_get_serie_port, update_leaf_position } from "../_common/common_functions";
/*
    ---- Define el modelo del nodo (Weighted Average Block) ----
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
  weight?: number;
};

export type WeightedNode = {
  name: string;
  type: string;
  editado: boolean;
  public_id: string;
  parent_id?: string;
  posx: number;
  posy: number;
  connections: Array<PortData>;
  serial_connection: PortData | undefined;
};

export type WeightedItem = {
  public_id: string;
  weight: number;
}

export interface WeightedNodeParams {
  PORT: SerialOutPortModel;
  node: WeightedNode;
}

// Aquí se definen las funciones del nodo

export class WeightedNodeModel extends NodeModel<
  WeightedNodeParams & NodeModelGenerics
> {
  data: WeightedNode;
  edited: boolean;
  valid: boolean;
  weight: Array<WeightedItem>;

  constructor(params: { node: any }) {
    super({ type: "WeightedNode", id: params.node.public_id });
    this.data = params.node;
    this.addPort(new SerialOutPortModel("SERIE"));
    this.addPort(new InPortModel("InPut"));

    this.data.connections.forEach((parallel) => {
      this.addPort(new WeightedOutPortModel(parallel.public_id));
    });
    this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
    this.weight = [];
  }

  create_if_not_exist = async() => {
    if (this.getID().includes("WeightedNode")) {
      // Este es un nodo nuevo:
      let path = `${SCT_API_URL}/block-leaf/block-root/${this.data.parent_id}`;
      let payload = JSON.stringify({
        name: "PONDERADO",
        document: this.getType(),
        calculation_type: "PONDERADO",
        position_x_y: [this.getPosition().x, this.getPosition().y],
      });
      await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("create", json);
          return true;
        })
        .catch(console.log);
    }
    return false;
  };


  // Actualiza la posición del elemento
  updatePosition = () => {
    update_leaf_position(this.data.parent_id, this.data.public_id, this.getPosition().x, this.getPosition().y);
  };

  // Permite validar que el elemento ha sido correctamente conectado
  validate = () => {
    let valid = true;
    for (var type_port in this.getPorts()) {
      // todos los nodos deben estar conectados
      // a excepción del puerto SERIE ya que es opcional
      if (type_port !== "SERIE") {
        var port = this.getPorts()[type_port];
        valid = valid && Object.keys(port.links).length === 1;
      }
    }
    this.valid = valid;
    return valid;
  };

  performanceTune = () => {
    this.validate();
    return true;
  };

  setNodeInfo(data: WeightedNode) {
    this.data = data;
  }

  // TODO: actualizar la posicion de un elemento interno
  updateBlock = () => {
    let ports = this.getPorts();
    let operator_ids = [];
    for (var id_port in ports) {
      let port = ports[id_port];
      if (port.getType() === "PONDERADO") {
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

  // Esta función permite generar la topología a realizar dentro del bloque:
  // Se maneja dos tipode conexiones: Paralela, Serie
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    let topology = {};
    let p_nodes = this.get_nodes_connected_weighted();
    if (p_nodes) {
      let ids = [];
      p_nodes.forEach((port) => ids.push(port.getID()));
      topology["PONDERADO"] = ids;
    }
    let s_node = this.get_node_connected_serie();
    if (p_nodes && s_node) {
      // conexiones paralelas y serie
      topology = {
        SERIE: [
          topology,
          s_node.getID()
        ]
      }
    } else if (s_node) {
      // solamente conexion serie
      topology["SERIE"] = [s_node.getID()];
    }
    return topology;
  };

  get_weighted_ports = () => {
    return _.filter(this.ports, (portModel) => {
      return portModel.getType() === "PONDERADO";
    });
  }

  get_nodes_connected_weighted = () => {
    let ports = this.get_weighted_ports();
    if (ports.length < 2) {
      return null;
    }
    // buscando los nodos conectados de manera PONDERADA
    let nodes = [];
    for (let id_port in ports) {
      let links = ports[id_port].links;
      for (let id_link in links) {
        if (links[id_link].getSourcePort().getType() !== "PONDERADO") {
          nodes.push(links[id_link].getSourcePort().getNode());
        } else {
          nodes.push(links[id_link].getTargetPort().getNode());
        }
      }
    }
    return nodes;
  };

  // obtener puerto serie:
  get_serie_port = () => {
    return common_get_serie_port(this.ports);
  };

   // get node connected in SERIE port:
   get_node_connected_serie = () => {
    return common_get_node_connected_serie(this.ports);
  };

  // TODO: actualizar mensaje
  delete = () => {
    let path = SCT_API_URL + "/block-root/" + this.data.parent_id + "/operation/" + this.data.public_id;
    fetch(path, { method: "DELETE", headers: { "Content-Type": "application/json" } })
      .then((res) => res.json())
      .then((json) => { console.log(json) });   
  };

  addWeightedPort = () => {
    let newH = Object.assign([], this.data.connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    let p_port = {
      name: "",
      public_id: "PWeighted_" + this.data.public_id + "_" + next_id,
    };
    newH.push(p_port);
    // edititing the node:
    this.data.connections = newH;
    this.addPort(new WeightedOutPortModel(p_port.public_id));
    return {data:this.data}
  }

  deleteWeightedPort = (id_port) => {
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
  }

}
