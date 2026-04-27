import { Component } from "react";

import PopUp from "./PopUp";
import Table from "../table/Table";
import Loading from "../misc/Loading";

import tableOptions from "../../assets/json/table_options/freightDataOptions.json";

import FrenetUtils from "../../utils/Frenet";

class PopUpFreight extends Component {
  render() {
    const { isOpen, onClose, data } = this.props;
    const adjustedData = FrenetUtils.ajustFreightData(data);
    return (
      <PopUp isOpen={isOpen} onClose={onClose}>
        <h2>Frete Calculado</h2>
        {adjustedData ? (
          <Table options={tableOptions} datas={adjustedData} search={false} />
        ) : (
          <div className="loading-container">
            <Loading />
          </div>
        )}
      </PopUp>
    );
  }
}

export default PopUpFreight;
