import {
  NodeModel as RootModel,
  NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { OutPortModel } from "./OutPort";
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
  name: string,
  type: string,
  editado: boolean,
  public_id: string,
  parent_id?: string,
  posx: number,
  posy: number,
};

export interface BlockRootParams {
  PORT: OutPortModel;
  root: Root;
}

// Aquí se definen las funciones del nodo

export class BlockRootModel extends RootModel<
  BlockRootParams & NodeModelGenerics
> {
  data: Root;
  edited: boolean;

  constructor(params: { root: any }) {
    super({ type: "BlockRoot", id: params.root.public_id });
    this.data = params.root;
    this.addPort(new OutPortModel("OutPut"));
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

  setRootInfo(_root: Root) {
    this.data = _root;
  }

  getOutPorts() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.in;
    });
  }
}
