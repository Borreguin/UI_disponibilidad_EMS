import React, { Component } from "react";
// For diagrams:
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultLinkModel,
  PortModelAlignment,
  DiagramEngine,
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
import { Button } from "react-bootstrap";
import { right } from "@popperjs/core";

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
  engine: DiagramEngine;
  model: DiagramModel;
  test: string;
  constructor(props) {
    super(props);
    this.engine = null;
    this.model = null;
    this.test = "";
  }
  
  // Evita actualización innecesaria
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

  create_nodes = () => {
    const { static_menu } = this.props;
    let nodes = [];
    static_menu.blocks.forEach((block) => {
      console.log(block);
      let data = {
        name: block.name,
        editado: false,
        public_id: block.public_id,
        parent_id: static_menu.public_id,
        posx: block.object.position_x_y[0],
        posy: block.object.position_x_y[1],
      }

      var node = null;
      switch (block.object.document) {
        case "BloqueLeaf":
          data["parallel_connections"] = [];
          node = new BlockNodeModel({ node: data })
          break;
        case "AverageNode":
          data["connections"] = [];
          node = new AverageNodeModel({ node: data });
          break;
        case "WeightedNode":
          data["connections"] = [];
          node = new WeightedNodeModel({ node: data });
          break;
      }
      if (node !== null) {
        nodes.push(node);
      }
    });
    return nodes;
  };

  create_links = () => {
    


  }

  /*
  create_block_operations = () => {
    let operations = this.props.static_menu.object.operations;
    let nodes = [];
    operations.forEach((operation) => {
      let connections = [];
      operation.operator_ids.forEach((operador_id) => {
        connections.push({ name: operador_id, public_id: operador_id })
      })
      let operation_data = {
        public_id: operation.public_id,
        name: operation.name,
        type: operation.type,
        editado: false,
        parent_id: this.props.static_menu.public_id,
        posx: operation.position_x_y[0],
        posy: operation.position_x_y[1],
        connections: connections,
        serial_connection: [],
      };
      let node = null;
      switch (operation.type) {
        case "AverageNode":
          node = new AverageNodeModel({ node: operation_data });
          nodes.push(node);
          break;
        case "WeightedNode":
          node = new WeightedNodeModel({ node: operation_data });
          nodes.push(node);
          break;
      }
    });
    return nodes;
  };*/

  create_selected_node = (type:string, parent_id:string) => {
    // Se crea un nodo dependiendo el botón seleccionado:
    var node = null;
    let data = null;
    switch (type) {
      case "AverageNode":
        // Nodo de tipo promedio
      data = {
        name: "PROMEDIO",
        editado: false,
        public_id: _.uniqueId("AverageNode_"),
        parent_id: parent_id,
        connections: [],
        serial_connection: [],
      };
      node = new AverageNodeModel({ node: data });
      // añadiendo mínimo 2 puertos promedio:
      node.addAveragePort();
      node.addAveragePort()
        break;
      
      case "WeightedNode":
        data = {
          name: "PONDERADO",
          editado: false,
          public_id: _.uniqueId("WeightedNode_"),
          parent_id: parent_id,
          connections: [],
          serial_connection: [],
        };
        node = new WeightedNodeModel({ node: data });
        // añadiendo mínimo 2 puertos ponderados:
        node.addWeightedPort();
        node.addWeightedPort();
        break;
    };
    return node;
  }

  save_graph_as_serial = () => {
    console.log(this.model.serialize());
    //console.log(JSON.stringify(this.model.serialize()));
    //this.test = JSON.stringify(this.model.serialize());
  }

  load_graph_as_serial = () => {
    var model2 = new DiagramModel();
	  //model2.deserializeModel(JSON.parse(this.test), this.engine);
    //this.engine.setModel(model2);
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

    // Añadir nodos de acuerdo a cada tipo
    this.create_nodes().forEach((node) => model.addNode(node));

    engine.setModel(model);
    // Use this custom "DefaultState" instead of the actual default state we get with the engine
    engine.getStateMachine().pushState(new DefaultState());

    // el diagrama ha quedado actualizado:
    this.engine = engine;
    this.model = model;

    return (
      <>
        <TrayWidget>
          <TrayItemWidget
            model={{ type: "AverageNode" }}
            name="Promedio"
          />
          <TrayItemWidget
            model={{ type: "WeightedNode" }}
            name="Promedio ponderado"
          />
          <Button
            style={{ float: "right" }}
            variant="outline-warning"
            onClick={this.save_graph_as_serial}
          >Guardar</Button>
          <Button
            style={{ float: "right" }}
            variant="outline-success"
            onClick={ this.load_graph_as_serial}
          >Actualizar</Button>
        </TrayWidget>
        <div
          className="Layer"
          onDrop={(event) => {
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );
            let node = this.create_selected_node(data.type, parent_id);
            var point = engine.getRelativeMousePoint(event);
            node.setPosition(point);
            model.addNode(node);
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
