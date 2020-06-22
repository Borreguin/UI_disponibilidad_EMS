import React, { Component } from "react";
import RepGeneral from "../../components/Cards/Report/RepGeneral";
import "./styles.css";
import { Node } from "../../components/Cards/SRCard/SRCardModel";

type NodeReportProps = {
  nodes: Array<Node>;
  ini_date: Date;
  end_date: Date;
  calculating: boolean;
};


class NodeReport extends Component<NodeReportProps> {

 
  render() {
    return (
      <div>
        {this.props.nodes.length>0?
          this.props.nodes.map((node) => (
            <RepGeneral node={node} key={node.id_node}
              ini_date={this.props.ini_date} end_date={this.props.end_date}
              calculating={this.props.calculating}
            />
          )) :
          <></>
        }
      </div>
    );
  }
}
export default NodeReport;