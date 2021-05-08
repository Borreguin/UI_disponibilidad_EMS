import {
  LinkModel,
  PortModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import * as _ from "lodash";

export class InPortModel extends PortModel {
  constructor(name: string) {
    super({
      type: "InPort",
      name: name,
      alignment: PortModelAlignment.LEFT,
      connected_to: name,
    });
  }

  canLinkToPort(port: PortModel) {
    // Esta función comprueba si se puede realizar las conexiones:
    // 1. Input -> SerialOut
    // 2. Input -> PARALELO
    // 3. Input -> Output (conexión con root) 
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

  createLinkModel(): LinkModel {
    return new DefaultLinkModel();
  }

  serialize() {
    // const position = this.position;
    /*return _.merge(super.serialize(),
			{nx: this.position.x, ny: this}
		)*/
    return _.merge({ port: this });
  }
}
