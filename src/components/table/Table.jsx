import { Component } from "react";

import Utils from "../../utils/Utils";

// Components
import CheckBox from "../inputs/InputCheckBox";
import Loading from "../misc/Loading";
import InputRadio from "../inputs/InputRadio";
import Select from "../inputs/Select";

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
    const { format, name, key } = option;
    // Checkbox de seleção de itens
    if (format === "checkbox" && key === "ID") {
      return (
        <CheckBox
          checked={
            (this.props.selectedItems &&
              this.props.selectedItems.length == this.props.datas.length &&
              this.props.datas.length > 0) ||
            false
          }
          onChange={() => {
            this.props.selectedItems &&
            this.props.selectedItems.length == this.props.datas.length &&
            this.props.datas.length > 0
              ? this.props.onSelectionChange([])
              : this.props.onSelectionChange(this.props.datas);
          }}
        />
      );
    }
    // Checkbox de status (ativo/inativo)
    if (format === "checkbox" && key === "ATIVO_ECOMMERCE") {
      return name || "";
    }
    return name || "";
  }

  formatValue(value, format, data, option, optionsSelect) {
    // Checkbox de seleção de itens
    if (format === "checkbox" && option.key === "ID") {
      return (
        <CheckBox
          checked={this.props.selectedItems?.includes(data) || false}
          onChange={() => {
            this.props.onSelectionChange && this.props.onSelectionChange(data);
          }}
        />
      );
    }
    // Checkbox de status (ativo/inativo)
    if (format === "checkbox" && option.fields) {
      const everyFieldTrue = option.fields.every((field) => data[field]);
      return (
        <CheckBox
          checked={everyFieldTrue}
          onChange={
            this.props.onActiveChange && (() => this.props.onActiveChange(data))
          }
        />
      );
    }
    // Select customizado
    if (format === "select") {
      return (
        <Select
          options={optionsSelect || []}
          value={data[option.key]}
          onChange={(selectedValue) => {
            if (this.props.onSelectChange) {
              this.props.onSelectChange(data, option, selectedValue);
            }
          }}
        />
      );
    }
    switch (format) {
      case "date-time":
        return Utils.formatDateTime(value);
      case "paste": {
        const fields = option.fields || [];
        const valuesToPaste = fields.map((field) => data[field]);
        return Utils.formatPasteValues(valuesToPaste);
      }
      case "currency":
        return Utils.formatCurrency(value);
      case "radio":
        return (
          <InputRadio
            name={option.key}
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
      hover = false,
      onClickRow = () => {},
      optionsSelect = [],
    } = this.props;
    const tableMaxHeight = this.props.maxHeight ?? "100%";

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
          maxHeight: tableMaxHeight,
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
                  className={`${rowIndex % 2 === 0 ? "even-row" : "odd-row"} ${hover ? "hover-row" : ""}`}
                  onClick={() => onClickRow(data)}
                >
                  {options.map((option) => (
                    <td key={option.key}>
                      {this.formatValue(
                        data[option.key],
                        option.format || "",
                        data,
                        option,
                        optionsSelect || [],
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
