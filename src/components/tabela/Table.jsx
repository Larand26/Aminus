import { Component } from "react";

import Utils from "../../utils/Utils";

import "../../styles/components/table/table.css";

class Table extends Component {
  state = {
    searchTerm: "",
    handleSearchChange: (e) => {
      this.setState({ searchTerm: e.target.value });
    },
  };

  searchData(data) {
    const { searchTerm } = this.state;
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return Object.values(data).some((value) =>
      String(value).toLowerCase().includes(lowerSearchTerm),
    );
  }

  formatValue(value, format, data, option) {
    switch (format) {
      case "date-time":
        return Utils.formatDateTime(value);

      case "paste":
        const fields = option.fields || [];
        const valuesToPaste = fields.map((field) => data[field]);
        return Utils.formatPasteValues(valuesToPaste);

      case "currency":
        return Utils.formatCurrency(value);

      default:
        if (value instanceof Date) {
          return value.toLocaleString("pt-BR", {
            timeZone: "UTC",
          });
        }
        return value || "";
    }
  }

  render() {
    const {
      options = [],
      datas = [],
      noDataMessage = "No data available",
      loading = false,
      search = true,
    } = this.props;

    if (loading) {
      return <div className="table-loading">Loading...</div>;
    }

    const filteredDatas = datas.filter((data) => this.searchData(data));
    const emptyMessage =
      datas.length === 0
        ? noDataMessage
        : search && filteredDatas.length === 0
          ? "Nenhum resultado encontrado"
          : null;

    return (
      <div
        className="table-wrapper"
        style={{
          maxHeight: this.props.maxHeight ?? "500px",
          overflowY: "auto",
        }}
      >
        {search && (
          <div className="table-search">
            <input
              type="text"
              value={this.state.searchTerm}
              onChange={this.state.handleSearchChange}
            />
          </div>
        )}
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
            {emptyMessage ? (
              <tr>
                <td
                  className="table-no-data"
                  colSpan={Math.max(options.length, 1)}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredDatas.map((data, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "even-row" : "odd-row"}
                >
                  {options.map((option) => (
                    <td key={option.key}>
                      {this.formatValue(
                        data[option.key],
                        option.format || "",
                        data,
                        option,
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
