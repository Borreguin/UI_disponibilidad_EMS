import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import * as _ from "lodash";

export class InPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'InPort',
			name: name,
			alignment: PortModelAlignment.LEFT,
			connected_to: name
		});

	}
	
	canLinkToPort(port: PortModel) { 
		const connect = (Object.keys(port.links).length === 0) && (port.getType() === "default")
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
		return _.merge({port: this});
	};
	
}