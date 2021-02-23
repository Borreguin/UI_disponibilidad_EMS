import { Action, ActionEvent, InputType, State } from '@projectstorm/react-canvas-core';
import { PortModel, LinkModel, DiagramEngine } from '@projectstorm/react-diagrams-core';
import { MouseEvent, KeyboardEvent } from 'react';

/**
 * This state is controlling the creation of a link.
 */
export class CreateLinkState extends State<DiagramEngine> {
	sourcePort: PortModel;
	link: LinkModel;
	offsetX: number;
	offsetY: number;
	constructor() {
		super({ name: 'create-new-link' });

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (actionEvent: ActionEvent<MouseEvent>) => {
					
					const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);
					
					const {
						event: { clientX, clientY }
					} = actionEvent;

					let el_x = clientX;
					let el_y = clientY;
					if(element["position"] !== undefined && element["width"] !== undefined){
						el_x = element["position"].x + element["width"]/2;
						el_y = element["position"].y + element["height"] / 2;
						this.offsetX = clientX - el_x;
						this.offsetY = clientY - el_y;
					} 

					if (element instanceof PortModel && !this.sourcePort && Object.keys(element.links).length===0) {
						this.sourcePort = element;
						const link = this.sourcePort.createLinkModel();
						link.setSourcePort(this.sourcePort);
						link.getFirstPoint().setPosition(el_x, el_y);
						link.getLastPoint().setPosition(el_x , el_y );
						this.link = this.engine.getModel().addLink(link);
						this.engine.repaintCanvas();
						return
					}
					if (element instanceof PortModel && this.sourcePort && element !== this.sourcePort) {
						// observar restricciones de conexión
						if (this.sourcePort.canLinkToPort(element)) {
							this.link.setTargetPort(element);
							element.reportPosition();
							this.clearState();
							this.eject();
						} 
						this.engine.repaintCanvas();
						return
					}
					if (this.link !== undefined  && element === this.link.getLastPoint()) {
						this.link.point(clientX, clientY, -1);
						this.engine.repaintCanvas();
						return
					}
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
					if (!this.link) return;
					const { event } = actionEvent;
					this.link.getLastPoint().setPosition(event.clientX - this.offsetX, event.clientY - this.offsetY);
					this.engine.repaintCanvas();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.KEY_UP,
				fire: (actionEvent: ActionEvent<KeyboardEvent>) => {
					// on esc press remove any started link and pop back to default state
					if (actionEvent.event.keyCode === 27) {
						this.link.remove();
						this.clearState();
						this.eject();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	clearState() {
		this.link = undefined;
		this.sourcePort = undefined;
	}
}
