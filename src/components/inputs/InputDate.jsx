import { Component } from "react";

import "../../styles/components/inputs/input-date.css";

import Calendar from "../misc/Calendar";

import Utils from "../../utils/Utils";

class InputDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalendar: false,
      selectedDate: [null, null], // [Date, Date]
      clearSignal: 0,
    };

    this.containerRef = null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setContainerRef = (ref) => {
    this.containerRef = ref;
  };

  handleClickOutside = (event) => {
    if (this.containerRef && !this.containerRef.contains(event.target)) {
      this.handleHideCalendar();
    }
  };

  handleShowCalendar = () => {
    this.setState({ showCalendar: true });
  };

  handleHideCalendar = () => {
    this.setState((prevState) => ({ showCalendar: false }));
  };

  handleRemoveDates = (event) => {
    const { onChange = () => {} } = this.props;

    event.stopPropagation();
    this.setState((prevState) => ({
      selectedDate: [null, null],
      clearSignal: prevState.clearSignal + 1,
    }));

    onChange([null, null]);
  };

  handleCallbackCalendar = (dates) => {
    const { onChange = () => {} } = this.props;
    const shouldHideCalendar = Boolean(dates[0] && dates[1]);

    this.setState({
      selectedDate: dates,
      showCalendar: shouldHideCalendar ? false : this.state.showCalendar,
    });

    onChange(dates);
  };

  formatDateForInput = () => {
    const [firstDate, secondDate] = this.state.selectedDate;

    if (firstDate && secondDate) {
      return `${Utils.formatDateOutYear(firstDate)} - ${Utils.formatDateOutYear(secondDate)}`;
    }

    if (firstDate) {
      return Utils.formatDateOutYear(firstDate);
    }

    return "";
  };

  render() {
    const {
      value = "",
      onChange = () => {},
      label = "",
      placeholder = "",
    } = this.props;
    return (
      <div className="input-date-container" ref={this.setContainerRef}>
        {label && <label>{label}</label>}
        <div className="input-date" onClick={this.handleShowCalendar}>
          <input
            value={this.formatDateForInput()}
            onChange={onChange}
            placeholder={placeholder}
            readOnly
          />
          <i
            className={`fas ${this.state.selectedDate[0] || this.state.selectedDate[1] ? "fa-times" : "fa-calendar-alt"} icon-calendar`}
            onClick={
              this.state.selectedDate[0] || this.state.selectedDate[1]
                ? this.handleRemoveDates
                : this.handleShowCalendar
            }
          ></i>
        </div>
        <Calendar
          handleCallbackCalendar={this.handleCallbackCalendar}
          showCalendar={this.state.showCalendar}
          clearSignal={this.state.clearSignal}
        />
      </div>
    );
  }
}

export default InputDate;
