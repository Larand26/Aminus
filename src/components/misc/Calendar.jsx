import { Component } from "react";

import Button from "../buttons/Button";

import "../../styles/components/misc/calendar.css";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: {
        date: new Date(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        monthName: Calendar.months[new Date().getMonth()],
        days: this.buildDaysArray(new Date()) || [],
      },
      selectedDate: [null, null], // [Date, Date]
    };
  }
  static months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  handlePreviousMonth = () => {
    this.setState((prevState) => {
      const { month, year } = prevState.currentDate;
      const newMonth = month === 0 ? 11 : month - 1;
      const newYear = month === 0 ? year - 1 : year;
      return {
        currentDate: {
          ...prevState.currentDate,
          month: newMonth,
          year: newYear,
          monthName: Calendar.months[newMonth],
        },
      };
    });
  };

  handleNextMonth = () => {
    this.setState((prevState) => {
      const { month, year } = prevState.currentDate;
      const newMonth = month === 11 ? 0 : month + 1;
      const newYear = month === 11 ? year + 1 : year;
      return {
        currentDate: {
          ...prevState.currentDate,
          month: newMonth,
          year: newYear,
          monthName: Calendar.months[newMonth],
        },
      };
    });
  };

  setSelectedDate = (date) => {
    const newDate = new Date(date);
    const [firstSelected, secondSelected] = this.state.selectedDate;
    let nextSelectedDate = [newDate, null];

    if (firstSelected && !secondSelected) {
      if (newDate >= firstSelected) {
        nextSelectedDate = [firstSelected, newDate];
      } else {
        nextSelectedDate = [newDate, firstSelected];
      }
    }

    this.setState({ selectedDate: nextSelectedDate }, () => {
      if (typeof this.props.handleCallbackCalendar === "function") {
        this.props.handleCallbackCalendar(nextSelectedDate);
      }

      if (typeof this.props.onSelectDate === "function") {
        this.props.onSelectDate(nextSelectedDate);
      }
    });
  };

  classSelected = (date) => {
    const newDate = new Date(date);
    const [first, second] = this.state.selectedDate;

    const normalize = (d) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const current = normalize(newDate);

    if (first && current === normalize(first)) return "selected first";
    if (second && current === normalize(second)) return "selected second";
    if (
      first &&
      second &&
      current > normalize(first) &&
      current < normalize(second)
    ) {
      return "selected between";
    }

    return "";
  };

  /**
   *
   * @param {Date} date
   * @returns {Array} [ { day: Number, isCurrentMonth: Boolean, date: Date } ...]
   */
  buildDaysArray(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 (Dom) a 6 (Sáb)

    const daysArray = [];

    // Dias do mês anterior para preencher a primeira semana
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(year, month, -i).getDate();
      daysArray.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month, -i),
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    if (daysArray.length < 42) {
      const remainingDays = 42 - daysArray.length;
      for (let i = 1; i <= remainingDays; i++) {
        daysArray.push({
          day: i,
          isCurrentMonth: false,
          date: new Date(year, month + 1, i),
        });
      }
    }

    return daysArray;
  }

  render() {
    return (
      <div
        className={`calendar ${this.props.showCalendar ? "show" : "hidden"}`}
      >
        <div className="calendar-header">
          <Button
            onClick={this.handlePreviousMonth}
            icon="fa fa-chevron-left"
          />
          <div className="calendar-header-title">
            <span className="month">{this.state.currentDate.monthName}</span>
            <span className="year">{this.state.currentDate.year}</span>
          </div>
          <Button onClick={this.handleNextMonth} icon="fa fa-chevron-right" />
        </div>
        <hr />
        <div className="calendar-body">
          <div className="calendar-weekdays">
            <div className="weekday">Dom</div>
            <div className="weekday">Seg</div>
            <div className="weekday">Ter</div>
            <div className="weekday">Qua</div>
            <div className="weekday">Qui</div>
            <div className="weekday">Sex</div>
            <div className="weekday">Sáb</div>
          </div>
          <div className="calendar-days">
            {this.buildDaysArray(
              new Date(
                this.state.currentDate.year,
                this.state.currentDate.month,
                1,
              ),
            ).map((dayObj, index) => (
              <Button
                key={`${dayObj.day}-${index}`}
                text={String(dayObj?.day || "")}
                className={`button-day ${dayObj.isCurrentMonth ? "current-month" : "other-month"} ${this.classSelected(dayObj.date)}`}
                onClick={() => this.setSelectedDate(dayObj.date)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
