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

type NodeCanvasProps = {
    nodes: Array<Node>
    diagram: Object
}

class NodeCanvas extends Component<NodeCanvasProps> {
    
    // static defaultProps = {}

    render() {
        const { nodes, diagram } = this.props;
        
        console.log("diagram", diagram);
        
        //1) setup the diagram engine
        // IMPORTANTE: No se registra la manera por defecto de eliminar elementos 
        const engine = createEngine({ registerDefaultDeleteItemsAction: false });

        // 1.a) Register factories: Puertos y Nodos 
        engine.getPortFactories()
            .registerFactory(new SimplePortFactory('SrNodePort', config => new SRPortModel(PortModelAlignment.RIGHT)));

        engine.getNodeFactories()
            .registerFactory(new SRNodeFactory());
        
        
        
        
        //2) setup the diagram model
        const model = new DiagramModel();
        if (diagram === undefined) {
            let y = 5;
            nodes.map((node) => {
                const _node = new SRNodeModel({ node: node });
                _node.setPosition(5, y);
                model.addNode(_node);
                //_node.addPort(new SRPortModel("test"));
                y += (100 + node.entidades.length * 22);
                //console.log(_node.serialize());
            })

        }
/*
        var node1 = new DefaultNodeModel({
            name: 'Node T1',
            color: 'rgb(0,192,255)'
        });
        node1.setPosition(100, 100);
        let port1 = node1.addOutPort('Out');

        var node2 = new DefaultNodeModel('Node T2', 'rgb(192,255,0)');
        let port2 = node2.addInPort('In');
        node2.setPosition(400, 100);
        
        model.addNode(node1);
        model.addNode(node2);
*/

        //var node2 = new SRNodeModel({node:nodes[2]});
	    //node2.setPosition(250, 108);
        
        //model.addNode(node2);
/*
        const node1 = new DefaultNodeModel({
		    name: 'Node 1',
		    color: 'rgb(0,192,255)'
	    });
        const port1 = node1.addOutPort("Out");
        node1.setPosition(100, 100);

        //3-B) create another default node
        const node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
        const port2 = node2.addInPort("In");
        node2.setPosition(400, 100);

        //3-C) link the 2 nodes together
        const link1 = port1.link(port2);

        //3-D) create an orphaned node
        const node3 = new DefaultNodeModel("Node 3", "rgb(0,192,255)");
        node3.addOutPort("Out");
        node3.setPosition(100, 200);*/

    //4) add the models to the root graph
    //model.addAll(node1, node2, node3, link1);

    //5) load model into engine
    engine.setModel(model);

    
    // 5.1 // Use this custom "DefaultState" instead of the actual default state we get with the engine
    engine.getStateMachine().pushState(new DefaultState());
        
        
    //6) render the diagram!*/
    return (
        <StyledCanvasWidget>
            <CanvasWidget className="srd-diagram" engine={engine} />
        </StyledCanvasWidget>
        );
    }
};
export default NodeCanvas;
