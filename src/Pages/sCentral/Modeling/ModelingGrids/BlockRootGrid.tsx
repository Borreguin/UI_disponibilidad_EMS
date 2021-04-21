import React, { Component } from "react";
// For diagrams:
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import {
  CanvasWidget,
  Action,
  ActionEvent,
  InputType,
} from "@projectstorm/react-canvas-core";
import { StyledCanvasWidget } from "../../../../components/Diagrams/helpers/StyledCanvasWidget";
import { BlockFactory } from "../NodeModels/BlockNode/BlockFactory";
import { static_menu } from "../../../../components/SideBars/menu_type";
import { BlockNodeModel } from "../NodeModels/BlockNode/BlockNodeModel";
import { BlockRootModel } from "../NodeModels/BlockRoot/BlockRootModel";
import { DefaultState } from "../../DefaultState";
import { BlockRootFactory } from "../NodeModels/BlockRoot/BlockRootFactory";
import { AverageNodeFactory } from "../NodeModels/AverageNode/AverageNodeFactory";
import { AverageNodeModel } from "../NodeModels/AverageNode/AverageNodeModel";
import { WeightedNodeFactory } from "../NodeModels/WeightedNode/WeightedNodeFactory";
import { WeightedNodeModel } from "../NodeModels/WeightedNode/WeightedNodeModel";
import { TrayWidget } from "../NodeModels/DragAndDropWidget/TrayWidget";
import { TrayItemWidget } from "../NodeModels/DragAndDropWidget/TrayItemWidget";
import "../NodeModels/DragAndDropWidget/styles.css";
import * as _ from "lodash";

type BlockRootGridProps = {
  static_menu: static_menu;
};

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
        name: string;
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

class BlockRootGrid extends Component<BlockRootGridProps> {
  shouldComponentUpdate(nexProps, nextState) {
    return false;
  }

  create_root_block = () => {
    var root_data = this.props.static_menu.object;
    // Estructura determinada para bloque Root:
    let Root = {
      name: root_data["name"],
      type: root_data["document"],
      editado: false,
      public_id: root_data["public_id"],
      parent_id: null,
      posx: root_data["position_x_y"][0],
      posy: root_data["position_x_y"][1],
    };
    return new BlockRootModel({ root: Root });
  };

  create_node_blocks = () => {
    const { static_menu } = this.props;
    let node_blocks = [];
    static_menu.blocks.forEach((block) => {
      // Estructura de bloque tipo nodo:
      let Node = {
        name: block.name,
        editado: false,
        public_id: block.public_id,
        parent_id: static_menu.public_id,
        posx: block.object["position_x_y"][0],
        posy: block.object["position_x_y"][1],
        parallel_connections: [],
      };
      let node = new BlockNodeModel({ node: Node });
      node_blocks.push(node);
    });
    return node_blocks;
  };

  create_block_operations = () => {
    let operation_blocks = this.props.static_menu.object.operation_blocks;
    let operations = [];
    operation_blocks.forEach((operation) => {
      let operation_data = {
        name: operation.name,
        type: operation.type,
        editado: false,
        public_id: operation.public_id,
        parent_id: this.props.static_menu.public_id,
        connections: [],
        serial_connection: [],
      };
    });
    

  }


  render() {
    //1) setup the diagram engine
    // IMPORTANTE: No se registra la manera por defecto de eliminar elementos
    let engine = createEngine({ registerDefaultDeleteItemsAction: false });
    let model = new DiagramModel();

    // 1.a) Register factories: Puertos y Nodos
    engine.getNodeFactories().registerFactory(new BlockFactory());
    engine.getNodeFactories().registerFactory(new BlockRootFactory());
    engine.getNodeFactories().registerFactory(new AverageNodeFactory());
    engine.getNodeFactories().registerFactory(new WeightedNodeFactory());

    // Empezando la población de grid:
    
    // Variables generales:
    let parent_id = this.props.static_menu.object["public_id"];
    
    // Añadir el bloque root (inicio de operaciones):
    model.addNode(this.create_root_block());

    // Añadir bloques tipo nodo:
    this.create_node_blocks().forEach((node) => model.addNode(node));

    // Añadir operaciones especiales 
    console.log("this.props.static_menu", this.props.static_menu);
    engine.setModel(model);
    // Use this custom "DefaultState" instead of the actual default state we get with the engine
    engine.getStateMachine().pushState(new DefaultState());

    return (
      <>
        <TrayWidget>
          <TrayItemWidget
            model={{ type: "AverageNode" }}
            name="Promedio"
            color="rgb(192,255,0)"
          />
          <TrayItemWidget
            model={{ type: "WeightedNode" }}
            name="Promedio ponderado"
            color="rgb(0,192,255)"
          />
        </TrayWidget>
        <div
          className="Layer"
          onDrop={(event) => {
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );

            // console.log(engine.getModel().getNodes(), data);
            var node = null;
            if (data.type === "AverageNode") {
              // Nodo de tipo promedio
              let Average_data = {
                name: "PROMEDIO",
                type: "AverageNode",
                editado: false,
                public_id: _.uniqueId("AverageNode_"),
                parent_id: parent_id,
                connections: [],
                serial_connection: [],
              };
              node = new AverageNodeModel({ node: Average_data });
              // añadiendo mínimo 2 puertos paralelos:
              node.addAveragePort();
              node.addAveragePort();
            } else if (data.type === "WeightedNode") {
              // Nodo de tipo promedio ponderado
              let w_average_data = {
                name: "PONDERADO",
                type: "WeightedNode",
                editado: false,
                public_id: _.uniqueId("WeightedNode_"),
                parent_id: parent_id,
                connections: [],
                serial_connection: [],
              };
              node = new WeightedNodeModel({ node: w_average_data });
              // añadiendo mínimo 2 puertos paralelos:
              node.addWeightedPort();
              node.addWeightedPort();
            }
            console.log(node);
            var point = engine.getRelativeMousePoint(event);
            node.setPosition(point);
            model.addNode(node);
            console.log("me working 2", engine.getModel().getNodes());
            engine.repaintCanvas();
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
        >
          <StyledCanvasWidget className="grid">
            <CanvasWidget engine={engine} />
          </StyledCanvasWidget>
        </div>
      </>
    );
  }
}

export default BlockRootGrid;
