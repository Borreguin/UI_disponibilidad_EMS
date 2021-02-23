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
import { DefaultState } from '../../DefaultState';

type BlockRootGridProps = {
    static_menu: static_menu
}


class BlockRootGrid extends Component<BlockRootGridProps>{ 

    render() { 
        const { static_menu } = this.props;
        let blocks = static_menu.blocks;
         //1) setup the diagram engine
        // IMPORTANTE: No se registra la manera por defecto de eliminar elementos 
        const engine = createEngine({ registerDefaultDeleteItemsAction: false });
        const model = new DiagramModel();
        
        // 1.a) Register factories: Puertos y Nodos 
        engine.getNodeFactories()
            .registerFactory(new BlockFactory());
        
        
        /* 
            Esta grid permite el manejo de bloques leafs.
            Se transforma a las siguientes estructuras de datos:
        From:
        type static_menu = {
            parent_id: string,
            name: string,
            public_id: string,
            icon?: IconDefinition,
            blocks?: Array<block>
            object: Object,
        }
        type block = {
            name: string,
            public_id: string,
            object: Object,
        }
            
        To:
        type Node = {
            nanme: string;
            type: string;
            editado: boolean;
            public_id: string;
            parent_id?: string;
            posx: number;
            posy: number;
            parallel_connections: Array<Node>;
            serial_connection: Node | undefined;
        };
        */
        
        blocks.forEach((block) => { 
            let Node = {
                name: block.name,
                editado: false,
                public_id: block.public_id,
                parent_id: static_menu.public_id,
                posx: block.object["position_x_y"][0],
                posy: block.object["position_x_y"][1],
                parallel_connections: []
            }
            let node = new BlockNodeModel({ node: Node });
            model.addNode(node);
        });

      
        engine.setModel(model);
        // Use this custom "DefaultState" instead of the actual default state we get with the engine
	    engine.getStateMachine().pushState(new DefaultState());
        return(<StyledCanvasWidget className="grid">
            <CanvasWidget  engine={engine} />
        </StyledCanvasWidget>)
    }
}

export default BlockRootGrid;