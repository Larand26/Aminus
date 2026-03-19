import { Component } from "react";

import CheckBox from "../inputs/InputCheckBox";

import "../../styles/components/misc/configuration.css";

class Configuration extends Component {
  render() {
    // config = [ { name: "Config 1", value: "Value 1", onChange: () => {} }, { name: "Config 2", value: "Value 2", onChange: () => {} } ]
    const { isOpen = false, configs = [], children = null } = this.props;
    return (
      <div className={`configuration-container ${isOpen ? "show" : "hidden"}`}>
        <div className="configuration">
          <h2>Configurações</h2>
          <div className="config-list">
            {configs.map((config, index) => (
              <div key={index} className="config-item">
                <span className="config-name">{config.name}</span>
                <CheckBox
                  checked={config.value}
                  onChange={(e) => {
                    if (config.onChange) {
                      config.onChange(e.target.checked);
                    } else {
                      console.warn(
                        `Configuração "${config.name}" não possui função onChange.`,
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Configuration;
