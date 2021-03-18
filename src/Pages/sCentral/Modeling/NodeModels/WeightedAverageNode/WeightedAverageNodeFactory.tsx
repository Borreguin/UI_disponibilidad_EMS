import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { WeightedAverageNodeModel as WeightedAverageNodeModel } from './WeightedAverageNodeModel';
import { WeightedAverageNodeWidget } from './WeightedAverageNodeWidget'

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo

	NOTA: Esta función puede permitir actualizar los nodos internos
*/
export class WeightedAverageNodeFactory extends AbstractReactFactory<WeightedAverageNodeModel, DiagramEngine> {
	constructor() {
		super('WeightedAverageNode');
	}
	// genera el widget
	generateReactWidget(event: { model: WeightedAverageNodeModel; }): JSX.Element {
		return <WeightedAverageNodeWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(node: any) {
		return new WeightedAverageNodeModel({node:node});
	}

}