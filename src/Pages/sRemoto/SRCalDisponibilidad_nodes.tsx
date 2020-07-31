import React, { Component } from "react";
import "./styles.css";
import { SummaryReport } from "../../components/Reports/SRReport/Report";
import IndividualReport from "../../components/Reports/SRReport/IndividualReport";
import StatusCalcReport from "../../components/Reports/SRReport/StatusCalcReport";

type NodeReportProps = {
  reports: Array<SummaryReport>;
  ini_date: Date;
  end_date: Date;
  calculating: boolean;
  onChange: Function;
};

class NodeReport extends Component<NodeReportProps> {
  render() {
    return (
      <div>
        {this.props.calculating ?
          <StatusCalcReport
            ini_date={this.props.ini_date}
            end_date={this.props.end_date}
            onFinish={this.props.onChange}
          />
          :
          <></>
        }
        {this.props.reports === undefined || this.props.calculating ? (
          <></>
        ) : (
          this.props.reports.map((report) => (
            <IndividualReport
              key={report.id_report}
              report={report}
              calculating={this.props.calculating}
              ini_date={this.props.ini_date}
              end_date={this.props.end_date}
              onChange={this.props.onChange}
            />
          ))
        )}
      </div>
    );
  }
}
export default NodeReport;
