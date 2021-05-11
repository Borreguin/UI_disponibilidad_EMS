
import { PortModel } from "@projectstorm/react-diagrams";
import { SCT_API_URL } from "../../../Constantes";

export const canLinkToInportPort = (port: PortModel) => {
    // Esta función comprueba si se puede realizar las conexiones:
    // 1. Input -> SERIE
    // 2. Input -> PARALELO
    // 3. Input -> ROOT (conexión con root) 
    // 4. Input -> PROMEDIO (conexión para operación: promedio)
    // 5. Input -> PONDERADO (conexión para operación: ponderado)
    const isSerialOutPort = port.getType() === "SERIE";
    const isParallelOutPort = port.getType() === "PARALELO";
    const isOutPut = port.getType() === "ROOT";
    const isAverageOutPut = port.getType() === "PROMEDIO";
    const isWeightedOutPut = port.getType() === "PONDERADO";
    const isFreeConnect = Object.keys(port.links).length === 0;
    const connect = isFreeConnect &&
      (isSerialOutPort || isParallelOutPort || isOutPut || isAverageOutPut || isWeightedOutPut);
    
    return connect;
}
  
 // obtener puerto serie:
export const common_get_serie_port = (ports) => {
  for (var id_port in ports) {
    if (ports[id_port].getType() === "SERIE") {
      return ports[id_port];
    }
  }
  return null;
};

// get node connected in SERIE port:
export const common_get_node_connected_serie = (ports) => {
  let port = common_get_serie_port(ports);
  if (port === null) {
    return null;
  }
  let links = port.links;
  // busancdo los nodos conectados de manera paralela
  for (let id_link in links) {
    if (links[id_link].getSourcePort().getType() !== "SERIE") {
      return links[id_link].getSourcePort().getNode();
    } else {
      return links[id_link].getTargetPort().getNode();
    }
  }
  return null;
};

export const update_leaf_position = (parent_id:string, public_id:string, pos_x:number, pos_y:number) => {
  let path = `${SCT_API_URL}/block-leaf/block-root/${parent_id}/block-leaf/${public_id}/position`;
  let body = { pos_x: pos_x, pos_y: pos_y };
  fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    })
    .catch(console.log);
}