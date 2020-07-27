import React, { Component } from "react";
import "./styles.css";
import { Tab } from "react-bootstrap";

type Selected = {
    utr_tipo: string,
    utr_nombre: string,
}

type SelectedID = {
    utr: string,
}

type SRModelingTagsProps = {
    selected: Selected;
    selected_id: SelectedID
};

class SRModelingTag extends Component<SRModelingTagsProps> {

  render() {
    return (
        <Tab 
        eventKey="dt-entidad"
        title={
          "Ingresar Tags en " +
          this.props.selected.utr_tipo +
          ": " +
          this.props.selected.utr_nombre
        }
      ></Tab>
    );
  }
}
export default SRModelingTag;