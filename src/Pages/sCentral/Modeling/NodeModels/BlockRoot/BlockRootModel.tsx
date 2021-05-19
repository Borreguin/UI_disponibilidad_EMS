import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { OutPortModel } from "./RootPort";
import { SCT_API_URL } from "../../../Constantes";
/*
    ---- Define el modelo del root  ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type Root = {
  name: string;
  type: string;
  editado: boolean;
  public_id: string;
  parent_id?: string;
  posx: number;
  posy: number;
};

export interface BlockRootParams {
  PORT: OutPortModel;
  root: Root;
}

// Aquí se definen las funciones del nodo

export class BlockRootModel extends NodeModel<
  BlockRootParams & NodeModelGenerics
> {
  data: Root;
  edited: boolean;
  valid: boolean;

  constructor(params: { root: any }) {
    super({ type: "BlockRoot", id: params.root.public_id });
    this.data = params.root;
    this.addPort(new OutPortModel("ROOT"));
    this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
  }

  updatePosition = () => {
    let path = SCT_API_URL + "/block-root/" + this.data.public_id + "/position";
    let body = { pos_x: this.getPosition().x, pos_y: this.getPosition().y };
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {})
      .catch(console.log);
  };

  updateTopology = () => {
    let topology = this.generate_topology();
    if (!topology) { return }
    let path = `${SCT_API_URL}/block-root/${this.data.public_id}/topology`;
    let body = { topology: topology };
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("topology", json);
      })
      .catch(console.log);
  };

  validate = () => {
    let valid = true;
    for (var name_port in this.getPorts()) {
      var port = this.getPorts()[name_port];
      valid = valid && Object.keys(port.links).length === 1;
    }
    this.valid = valid;
    return valid;
  };

  // Esta función permite generar la topología a realizar dentro del bloque:
  // Al ser solamente la operación Root la única que se puede realizar
  // entonces la operación queda reducida a:
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    let connected_node = this.get_node_connected_to_root();
    return {
      ROOT: [connected_node.getID()],
    };
  };

  get_root_port = () => {
    let ports = this.getPorts();
    for (var id_port in ports) {
      let port = ports[id_port];
      if (port.getType() === "ROOT") {
        return port;
      }
    }
    return null;
  };

  // obtiene el node al que está conectado el ROOT
  get_node_connected_to_root = () => {
    let root_node = this.get_root_port();
    if (root_node === null) {
      return null;
    }
    let links = root_node.links;
    for (var id_link in links) {
      let link = links[id_link];
      if (link.getSourcePort().getType() !== "ROOT") {
        return link.getSourcePort().getNode();
      } else {
        return link.getTargetPort().getNode();
      }
    }
  };

  performanceTune = () => {
    this.validate();
    return true;
  };

  setRootInfo(_root: Root) {
    this.data = _root;
  }

  getOutPorts() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.in;
    });
  }
}
