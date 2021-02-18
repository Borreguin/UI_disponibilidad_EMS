import React, { Component }  from 'react';
// For diagrams:
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel, PortModelAlignment} from '@projectstorm/react-diagrams';
import { CanvasWidget, Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';
import { StyledCanvasWidget } from '../../../../components/Diagrams/helpers/StyledCanvasWidget'
import { SimplePortFactory } from '../../../../components/Diagrams/helpers/SimplePortFactory'
import { SerialOutPortModel } from '../NodeModels/BlockNode/SerialOutputPort';
import { BlockFactory} from '../NodeModels/BlockNode/BlockFactory'
import { static_menu } from '../../../../components/SideBars/menu_type';
import { BlockNodeModel } from '../NodeModels/BlockNode/BlockNodeModel';

type BlockRootGridProps = {
    static_menu: static_menu
}


class BlockRootGrid extends Component<BlockRootGridProps>{ 

    render() { 
        const { static_menu } = this.props;
        console.log(static_menu); 
        console.log(static_menu.name); 
         //1) setup the diagram engine
        // IMPORTANTE: No se registra la manera por defecto de eliminar elementos 
        const engine = createEngine({ registerDefaultDeleteItemsAction: false });
        const model = new DiagramModel();
        
        // 1.a) Register factories: Puertos y Nodos 
        engine.getPortFactories()
            .registerFactory(new SimplePortFactory('SerialOutputPort', config => new SerialOutPortModel(PortModelAlignment.RIGHT)));

        engine.getNodeFactories()
            .registerFactory(new BlockFactory());
        
        
        
        //node2.setPosition(200, 200);

        var paralel = {
            nombre: "test1",
            public_id: "public3",
        }
        var paralel2 = {
            nombre: "test2",
            public_id: "public4",
        }
        
        var Node = {
            nombre: "Esta es una descripción larga muy larga",
            public_id: "public_id",
            activado: true,
            parallel_connections: [paralel, paralel2]
        }
        var myNode = {
            nombre: "Soy otro nodo",
            public_id: "public_id2",
            activado: true,
            parallel_connections: [paralel, paralel2]
        }
        
        var node1 = new BlockNodeModel({ node: Node });
        node1.addOutPort("Out");
        node1.addInPort("In");

        var node2 = new BlockNodeModel({ node: myNode });
        node2.addOutPort("Out");
        node2.addInPort("In");
        
        //model.addAll(node1, node2);
        model.addNode(node1);
        model.addNode(node2);
        engine.setModel(model);
        return(<StyledCanvasWidget className="grid">
            <CanvasWidget  engine={engine} />
        </StyledCanvasWidget>)
    }
}

export default BlockRootGrid;