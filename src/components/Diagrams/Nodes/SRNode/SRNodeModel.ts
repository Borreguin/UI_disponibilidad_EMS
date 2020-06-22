import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { SRPortModel } from './SRPortModel';
//import { NextPortModel } from '../../helpers/NextPortModel'
//import { NextPortLabel } from '../../helpers/NextPortLabelWidget'

/*
    ---- Define el modelo del nodo ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type Entity = {
    entidad_nombre: string,
    entidad_tipo: string,
    n_tags: number,
    utrs: number,
    activado: boolean
}

export type Node = {
    nombre: string,
    tipo: string,
    n_tags: number,
    actualizado: string,
    activado: boolean,
    entidades: Array<Entity>
}


export interface SRNodeModelParams {
    PORT: SRPortModel;
	node: Node;
}

export class SRNodeModel extends NodeModel<SRNodeModelParams & NodeModelGenerics>{
    data: Node;
    edited: boolean;

    constructor(params: { node: any; }) {
        super({ type: 'srnode', id: (params.node.tipo + "$" + params.node.nombre) });
        this.data = params.node
        this.data.entidades.map((entidad) => (
            this.addPort(new SRPortModel(entidad.entidad_nombre))
        ))
        this.edited = false;
	}

    updateNombre = (e) => {
        const in_text = e.target.value;
        if (this.data.nombre !== in_text && in_text.length > 1) { 
            this.data.nombre = in_text.trim();
            this.edited = true;
        }
        this.setLocked(false)
    };

    updateTipo = (e) => {
        const in_text = e.target.value;
        if (this.data.tipo !== in_text && in_text.length > 1) { 
            this.data.tipo = in_text.trim();
            this.edited = true;
        }
        this.setLocked(false)
    };

    updateActivo = () => { 
        console.log("check", this.data.activado)
        this.data.activado = !this.data.activado;
        this.edited = true;
    }

	setNodeInfo(_node: Node) { 
		this.data = _node;
	}

	addNextPort(label: any) {
        this.addPort(new SRPortModel(PortModelAlignment.RIGHT));
    }

    generateNextPort = (port) => {
        this.addPort(new SRPortModel(PortModelAlignment.RIGHT));
    }
    
}
