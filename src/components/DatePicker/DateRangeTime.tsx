import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

export interface RangeDateProps {
  last_month?: boolean,
  onPickerChange: Function,
  ini_date?: Date|undefined,
  end_date?: Date|undefined,
}

export type RangeDateState = {
  ini_date: Date,
  end_date: Date
}

export const to_yyyy_mm_dd = (date) => { 
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

export const to_yyyy_mm_dd_hh_mm_ss = (date: Date) => { 
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " 
    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

export const get_last_month_dates = () => { 
  let now = new Date();
  let last_day_month = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  let first_day_month = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  first_day_month.setMonth(now.getMonth() - 1);
  first_day_month.setDate(1);
  last_day_month.setDate(0);
  
  return {first_day_month:first_day_month, last_day_month:last_day_month}

}

export class DateRangeTime extends React.Component<RangeDateProps, RangeDateState>{
  
  constructor(props) { 
    super(props);
    this.state = {
      ini_date: new Date(),
      end_date: new Date()
    }
    if (this.props.last_month) {
      let r = get_last_month_dates()
      this.state = {
        ini_date: r.first_day_month,
        end_date: r.last_day_month
      }
    } 
    if (this.props.ini_date !== undefined && this.props.end_date !== undefined) { 
      this.state = {
        ini_date: this.props.ini_date,
        end_date: this.props.end_date
      }
    }
    this.handle_picker_change();
  }
  

  // funcion que llama a funcion de parametro onChange
  // ligada al padre
  handle_picker_change = () => {
    this.props.onPickerChange(this.state.ini_date, this.state.end_date);
  };

  setStartDate = (date) => { 
    if (date < this.state.end_date) { 
      this.setState({ ini_date: date })
      this.props.onPickerChange(date, this.state.end_date);
    }
  }

  setEndDate = (date) => { 
    if (date > this.state.ini_date) { 
      this.setState({ end_date: date })
      this.props.onPickerChange(this.state.ini_date, date);
    }
  }

  render() { 
    return (
      <div className="div-pick-timer-container">
        <div>
          <div className="div_pick-timer-middle">
            <DatePicker
              showTimeSelect
              className="picker-timer-div"
              selected={this.state.ini_date}
              onChange={(date) => this.setStartDate(date)}
              onBlur={(date) => this.setStartDate(date)}
              selectsStart
              startDate={this.state.ini_date}
              endDate={this.state.end_date}
              dateFormat="yyyy/MMM/d h:mm a"
            />
          </div>
        </div>
        <div>
          <DatePicker
            showTimeSelect
            className="picker-timer-div"
            selected={this.state.end_date}
            onChange={(date) => this.setEndDate(date)}
            onBlur={(date) => this.setEndDate(date)}
            selectsEnd
            startDate={this.state.ini_date}
            endDate={this.state.end_date}
            minDate={this.state.ini_date}
            dateFormat="yyyy/MMM/d h:mm a"
          />
        </div>
      </div>
    );
  }
};
