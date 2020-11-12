import React, { Component } from "react";
import SRCard from "../../../components/Cards/SRCard/SRCard";
import "../styles.css";
// import * as _ from "lodash";
//import { Accordion, Card, Button, Collapse, CardBody } from "react-bootstrap";
import { Node } from "../../../components/Cards/SRCard/SRCardModel";

type NodePanelProps = {
  nodes: Array<Node>;
};

class NodePanel extends Component<NodePanelProps> {

  render() {
    return (
      <div>
        {this.props.nodes.length>0?
          this.props.nodes.map((node) => (
          <SRCard node={node} key={node.id_node} />
          )) :
          <></>
        }
      </div>
    );
  }
}
export default NodePanel;
