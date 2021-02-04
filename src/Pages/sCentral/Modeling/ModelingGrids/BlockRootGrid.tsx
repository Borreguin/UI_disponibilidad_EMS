import React, { Component }  from 'react';
// For diagrams:
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel, PortModelAlignment} from '@projectstorm/react-diagrams';
import { CanvasWidget, Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';
import { StyledCanvasWidget } from '../../../../components/Diagrams/helpers/StyledCanvasWidget'
import { SimplePortFactory } from '../../../../components/Diagrams/helpers/SimplePortFactory'
import { SerialPort } from '../NodeModels/SerialPort';
import { BlockFactory} from '../NodeModels/BlockNode/BlockFactory'

class BlockRootGrid extends Component{ 

    render() { 
         //1) setup the diagram engine
        // IMPORTANTE: No se registra la manera por defecto de eliminar elementos 
        const engine = createEngine({ registerDefaultDeleteItemsAction: false });
        const model = new DiagramModel();
        
        // 1.a) Register factories: Puertos y Nodos 
        engine.getPortFactories()
            .registerFactory(new SimplePortFactory('SrNodePort', config => new SerialPort(PortModelAlignment.RIGHT)));

        engine.getNodeFactories()
            .registerFactory(new BlockFactory());
        
        
        var node1 = new DefaultNodeModel({
            name: 'Node T1',
            color: 'rgb(0,192,255)'
        });
        node1.setPosition(100, 100);
        model.addAll(node1);
        engine.setModel(model);
        return(<StyledCanvasWidget className="grid">
            <CanvasWidget  engine={engine} />
        </StyledCanvasWidget>)
    }
}

export default BlockRootGrid;