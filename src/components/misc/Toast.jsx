import { Component } from "react";

import "../../styles/components/misc/toast.css";

class Toast extends Component {
  render() {
    const { type, message } = this.props;
    return (
      <div className={`toast ${type}`}>
        <span>{message}</span>
        {type === "sucesso" && <i className="fa fa-check"></i>}
        {type === "falha" && <i className="fa fa-close"></i>}
        {type === "aviso" && <i className="fa fa-triangle-exclamation"></i>}
      </div>
    );
  }
}

export default Toast;
