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
    const isSerialOutPort = port.getType() === "SerialOutPut";
    const isParallelOutPort = port.getType() === "ParallelOutputPort";
    const isOutPut = port.getType() === "OutBlockPort";
    const isFreeConnect = Object.keys(port.links).length === 0;
    console.log(port.getType());
    const connect = isFreeConnect && (isSerialOutPort || isParallelOutPort || isOutPut);
    
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
