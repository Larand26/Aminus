import { Component } from "react";

import "../../styles/components/misc/progress-bar.css";

class ProgressBar extends Component {
  render() {
    const { total = 0, current = 0 } = this.props;
    const progress =
      total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;

    return (
      <div className="progress-bar-container">
        <div className="bar">
          <div className="bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-content">
          {current}/{total}
        </div>
      </div>
    );
  }
}

export default ProgressBar;
