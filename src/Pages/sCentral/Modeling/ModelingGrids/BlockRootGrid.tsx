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
import { WeightedAverageNodeFactory } from "../NodeModels/WeightedAverageNode/WeightedAverageNodeFactory";
import { WeightedAverageNodeModel } from "../NodeModels/WeightedAverageNode/WeightedAverageNodeModel";
import { TrayWidget } from "../NodeModels/DragAndDropWidget/TrayWidget";
import { TrayItemWidget } from "../NodeModels/DragAndDropWidget/TrayItemWidget";
import "../NodeModels/DragAndDropWidget/styles.css";
import * as _ from "lodash";

type BlockRootGridProps = {
  static_menu: static_menu;
};

class BlockRootGrid extends Component<BlockRootGridProps> {
  shouldComponentUpdate(nexProps, nextState) {
    return false;
  }

  render() {
    const { static_menu } = this.props;
    let blocks = static_menu.blocks;
    //1) setup the diagram engine
    // IMPORTANTE: No se registra la manera por defecto de eliminar elementos
    let engine = createEngine({ registerDefaultDeleteItemsAction: false });
    let model = new DiagramModel();

    // 1.a) Register factories: Puertos y Nodos
    engine.getNodeFactories().registerFactory(new BlockFactory());
    engine.getNodeFactories().registerFactory(new BlockRootFactory());

    engine.getNodeFactories().registerFactory(new AverageNodeFactory());

    engine.getNodeFactories().registerFactory(new WeightedAverageNodeFactory());

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
    var root_data = static_menu.object;
    let Root = {
      name: root_data["name"],
      type: root_data["document"],
      editado: false,
      public_id: root_data["public_id"],
      parent_id: null,
      posx: root_data["position_x_y"][0],
      posy: root_data["position_x_y"][1],
    };
    var root = new BlockRootModel({ root: Root });
    model.addNode(root);

    blocks.forEach((block) => {
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
      model.addNode(node);
    });

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
            model={{ type: "WeightedAverageNode" }}
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
            /*var nodesCount = _.keys(
                        this.props.app
                            .getDiagramEngine()
                            .getModel()
                            .getNodes()
                    ).length;*/
            console.log("me working", engine.getModel().getNodes(), data);
            var node = null;
            if (data.type === "AverageNode") {
              // Nodo de tipo promedio
              let Average_data = {
                name: "PROMEDIO",
                type: "AverageNode",
                editado: false,
                public_id: _.uniqueId("AverageNode_"),
                parent_id: root_data["public_id"],
                average_connections: [],
                serial_connection: [],
              };
              node = new AverageNodeModel({ node: Average_data });
              // añadiendo mínimo 2 puertos paralelos:
              node.addAveragePort();
              node.addAveragePort();
            } else if (data.type === "WeightedAverageNode") {
              // Nodo de tipo promedio ponderado 
              let w_average_data = {
                name: "PROMEDIO PONDERADO",
                type: "WeightedAverageNode",
                editado: false,
                public_id: _.uniqueId("WeightedAverageNode_"),
                parent_id: root_data["public_id"],
                average_connections: [],
                serial_connection: [],
              };
              node = new WeightedAverageNodeModel({ node: w_average_data });
              
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
