import React, { Component } from "react";

import CheckBox from "../inputs/InputCheckBox";

import "../../styles/components/table/table.css";

class Table extends Component {
  formatHeader(props) {
    const { label, type } = props;
    if (type === "checkbox") {
      return (
        <CheckBox
          checked={props?.allChecked || false}
          onChange={() =>
            props?.onChangeAll && props.onChangeAll(!props?.allChecked || false)
          }
        />
      );
    }
    return label;
  }
  render() {
    const { data = [], children = [] } = this.props;
    const { onclickRow = () => {} } = this.props;
    const columns = React.Children.toArray(children);

    return (
      <div
        className="table-wrapper"
        style={{ maxHeight: this.props.maxHeight || "600px" }}
      >
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.props.id}>{this.formatHeader(col.props)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? "odd-row" : "even-row"} ${onclickRow !== (() => {}) ? "hover-row" : ""}`}
                onClick={() => onclickRow(row)}
              >
                {columns.map((col) => (
                  <td key={col.props.id}>
                    {col.props.body ? col.props.body(row) : row[col.props.id]}
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
