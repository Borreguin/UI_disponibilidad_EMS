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
    // 2. Input -> ParallelOutputPort
    // 3. Input -> Output (conexión con root) 
    // 4. Input -> AverageOutputPort (conexión para operación: promedio)
    // 5. Input -> WeightedPort (conexión para operación: ponderado)
    const isSerialOutPort = port.getType() === "SerialOutPut";
    const isParallelOutPort = port.getType() === "ParallelOutputPort";
    const isOutPut = port.getType() === "OutBlockPort";
    const isAverageOutPut = port.getType() === "AverageOutputPort";
    const isWeightedOutPut = port.getType() === "WeightedPort";
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
