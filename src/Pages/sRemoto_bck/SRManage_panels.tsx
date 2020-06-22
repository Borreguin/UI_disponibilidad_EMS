import React, { Component }  from 'react';
// For diagrams:
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel, PortModelAlignment} from '@projectstorm/react-diagrams';
import { CanvasWidget, Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';
import { StyledCanvasWidget } from '../../components/Diagrams/helpers/StyledCanvasWidget'
import { SRNodeFactory } from '../../components/Diagrams/Nodes/SRNode/SRNodeFactory'
import { SRNodeModel } from '../../components/Diagrams/Nodes/SRNode/SRNodeModel'
import { SimplePortFactory } from '../../components/Diagrams/helpers/SimplePortFactory'

//require("@projectstorm/react-diagrams/dist/style.min.css")
import './styles.css'
import { SRPortModel } from '../../components/Diagrams/Nodes/SRNode/SRPortModel';
import { DefaultState } from './DefaultState';
import * as _ from "lodash";
import { Accordion } from 'react-bootstrap';



type Entity = {
    entidad_nombre: string,
    entidad_tipo: string,
    n_tags: number,
    utrs: number,
    activado: boolean
}

type Node = {
    nombre: string,
    tipo: string,
    n_tags: number,
    actualizado: string,
    activado: boolean,
    entidades: Array<Entity>
}

type NodePanelProps = {
    nodes: Array<Node>
    diagram: Object
}

class NodePanel extends Component<NodePanelProps> {
    

    render() {
        const { nodes, diagram } = this.props;
        
        
    return (
        <Accordion>
            
        </Accordion>
        );
    }
};
export default NodePanel;
