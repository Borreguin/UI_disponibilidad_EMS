import { SRNodeWidget } from './SRNodeWidget';
import { SRNodeModel } from './SRNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo
*/
export class SRNodeFactory extends AbstractReactFactory<SRNodeModel, DiagramEngine> {
	constructor() {
		super('srnode');
	}
	// genera el widget
	generateReactWidget(event: { model: SRNodeModel; }): JSX.Element {
		return <SRNodeWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(node: any) {
		return new SRNodeModel({node:node});
	}

}