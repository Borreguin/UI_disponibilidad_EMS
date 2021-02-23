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
    const isSerialOutPort = port.getType() === "SerialOutputPort";
    const isParallelOutPort = port.getType() === "ParallelOutputPort";
    const isFreeConnect = Object.keys(port.links).length === 0;
    const connect = isFreeConnect && (isSerialOutPort || isParallelOutPort);
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
