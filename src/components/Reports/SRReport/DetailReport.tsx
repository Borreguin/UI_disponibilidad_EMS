import React, { Component } from "react";
import "./style.css";
import { SummaryReport, reporte_nodo, reporte_entidad } from "./Report";
import { Card, OverlayTrigger, Tooltip, Badge, Button, CardGroup } from "react-bootstrap";
import {
  faAngleDoubleUp,
  faAngleDoubleDown,
  faTrash,
  faPenFancy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { to_yyyy_mm_dd } from "../../DatePicker/DateRange";
import ReactTooltip from "react-tooltip";

type DetReportProps = {
  report: reporte_nodo;
};

type DetReportState = {};

class DetailReport extends Component<DetReportProps, DetReportState> {
  _render_entity_report = (entity: reporte_entidad) => {
    return (
        <Card className="dr-entity">
            <Card.Header>
            {entity.entidad_tipo}: {entity.entidad_nombre}
            </Card.Header>
      </Card>
    );
  };

  render() {
    return (
      <CardGroup>
        {this.props.report.reportes_entidades.map((entity) =>
          this._render_entity_report(entity)
        )}
      </CardGroup>
    );
  }
}

export default DetailReport;
