import React, { Component } from "react";
// For diagrams:
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultLinkModel,
  PortModelAlignment,
  DiagramEngine,
  PortModel,
  DefaultPortModel,
  LinkModel,
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
import { InPortModel } from "../NodeModels/BlockNode/InPort";

type BlockRootGridProps = {
  static_menu: static_menu;
};

type WeightedConnection = {
  public_id: string,
  weight: string,
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
      name: root_data.name,
      type: root_data.document,
      editado: false,
      public_id: root_data.public_id,
      parent_id: null,
      posx: root_data.position_x_y[0],
      posy: root_data.position_x_y[1],
    };
    return new BlockRootModel({ root: Root });
  };

  create_root_link = () => {
    // Creación de link root
    var root_data = this.props.static_menu.object;
    
    if (root_data.topology && root_data.topology["ROOT"] !== undefined) {
      let root_node = this.model.getNode(root_data.public_id) as BlockRootModel;
      let node_id = root_data.topology["ROOT"][0];
      let node = this.model.getNode(node_id);
      let source_port = root_node.get_root_port();
      let target_port = node.getPort("InPut");
      let link = new DefaultLinkModel();
      link.setSourcePort(source_port);
      link.setTargetPort(target_port);
      this.model.addLink(link);
    }
  }

  // creando nodos de acuerdo a cada tipo.
  create_nodes = () => {
    const { static_menu } = this.props;
    let nodes = [];
    static_menu.blocks.forEach((block) => {
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

  connect_serie_if_exist = (topology:Object, serie_port) => {
    let next_topology = null;
    const operation = 'SERIE';
    if (topology.hasOwnProperty(operation)) {
      // Caso serie simple, se conecta con el primer miembro de la lista
      let node = null;
      if (topology[operation].length == 1) {
        node = this.model.getNode(topology[operation][0]);
      }
      // Caso serie avanzado, se conecta con el segundo miembro de la lista
      else if (topology[operation].length == 2) {
        next_topology = topology[operation][0];
        node = this.model.getNode(topology[operation][1]);
      }
      if (node === undefined) { return next_topology };
      // creando el link de conexión:
      let target_port = node.getPort("InPut");
      let link = new DefaultLinkModel();
      link.setSourcePort(serie_port);
      link.setTargetPort(target_port);
      this.model.addLink(link);
      return next_topology;
    }
    return topology;
  }

  create_node_links = () => {
    const { static_menu } = this.props;
    let next_topology = null;
    static_menu.blocks.forEach((block) => {
      let raw_node = this.model.getNode(block.public_id);
      // console.log(raw_node.getType());
      switch (raw_node.getType()) {
        case "BloqueLeaf":
          let block_node = raw_node as BlockNodeModel;
          next_topology = this.connect_serie_if_exist(block.object.topology, block_node.get_serie_port());
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PARALELO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[operation] as Array<string>;
              ids_operandos.forEach((id_operando) => {
                let node_to_connect = this.model.getNode(id_operando);
                if (node_to_connect !== undefined) {
                  let source_port = block_node.add_parallel_port(node_to_connect["data"]["name"]);
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              })
            }
          }
          break;
        case "AverageNode":
          let average_node = raw_node as AverageNodeModel;
          next_topology = this.connect_serie_if_exist(block.object.topology, average_node.get_serie_port());
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PROMEDIO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[operation] as Array<string>;
              ids_operandos.forEach((id_operando) => {
                let node_to_connect = this.model.getNode(id_operando);
                if (node_to_connect !== undefined) {
                  let source_port = average_node.add_average_port();
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              })
            }
          }
          break;
      
        case "WeightedNode":
          let weighted_node = raw_node as WeightedNodeModel;
          // identificar si existe topología en serie
          next_topology = this.connect_serie_if_exist(block.object.topology, weighted_node.get_serie_port());
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PONDERADO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[operation] as Array<WeightedConnection>;
              ids_operandos.forEach((connection) => {
                let node_to_connect = this.model.getNode(connection.public_id);
                if (node_to_connect !== undefined) {
                  let source_port = weighted_node.add_weighted_port(connection.public_id, parseFloat(connection.weight));
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              })
            }
          }
          break;
        
      }
    });
  }

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
          connections: [{
            public_id: _.uniqueId("WeightedPort_"),
            weight: 50
          }, {
            public_id: _.uniqueId("WeightedPort_"),
            weight: 50
          }],
          serial_connection: [],
        };
        node = new WeightedNodeModel({ node: data });
        // añadiendo mínimo 2 puertos ponderados:
        // node.addWeightedPort(null, 50);
        // node.addWeightedPort(null, 50);
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

    // lets update models and engine:
    this.model = model;
    this.engine = engine;

    // Añadir links
    // Link root
    this.create_root_link();
    
    // Link root de nodos:
    this.create_node_links();
    
    engine.setModel(this.model);
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
            <CanvasWidget engine={this.engine} />
          </StyledCanvasWidget>
        </div>
      </>
    );
  }
}

export default BlockRootGrid;
