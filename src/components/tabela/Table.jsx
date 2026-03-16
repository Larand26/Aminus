import { Component } from "react";

import "../../styles/components/table/table.css";

class Table extends Component {
  formatValue(value, format, data) {
    switch (format) {
      default:
        return value;
    }
  }

  render() {
    const {
      options = [],
      datas = [],
      noDataMessage = "No data available",
      loading = false,
    } = this.props;

    if (loading) {
      return <div className="table-loading">Loading...</div>;
    }

    if (datas.length === 0) {
      return <div className="table-no-data">{noDataMessage}</div>;
    }

    return (
      <div
        className="table-wrapper"
        style={{
          maxHeight: this.props.maxHeight ?? "500px",
          overflowY: "auto",
        }}
      >
        <table className="table">
          <thead>
            <tr>
              {options.map((option) => (
                <th key={option.key}>
                  {option.format === "checkbox" ? <></> : option.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datas.map((data, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "even-row" : "odd-row"}
              >
                {options.map((option) => (
                  <td key={option.key}>
                    {this.formatValue(
                      data[option.key],
                      (option.format = ""),
                      data,
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
