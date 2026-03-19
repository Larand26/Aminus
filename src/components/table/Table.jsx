import { Component } from "react";

import Utils from "../../utils/Utils";

// Components
import CheckBox from "../inputs/InputCheckBox";
import Loading from "../misc/Loading";

import "../../styles/components/table/table.css";

class Table extends Component {
  constructor(props) {
    super(props);
  }
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

  formatheader(option) {
    const { format, name } = option;
    switch (format) {
      case "checkbox":
        return (
          <CheckBox
            checked={
              (this.props.selectedItems.length == this.props.datas.length &&
                this.props.datas.length > 0) ||
              false
            }
            onChange={() => {
              this.props.selectedItems.length == this.props.datas.length &&
              this.props.datas.length > 0
                ? this.props.onSelectionChange([])
                : this.props.onSelectionChange(this.props.datas);
            }}
          />
        );
      default:
        return name || "";
    }
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

      case "checkbox":
        return (
          <CheckBox
            checked={this.props.selectedItems?.includes(data) || false}
            onChange={() => {
              this.props.onSelectionChange &&
                this.props.onSelectionChange(data);
            }}
          />
        );

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

    // if (loading) {
    //   return (
    //     <div className="table-loading">
    //       <Loading />
    //     </div>
    //   );
    // }

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
                <th key={option.key}>{this.formatheader(option)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="table-loading">
                <Loading />
              </div>
            ) : emptyMessage ? (
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
