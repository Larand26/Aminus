import { Component } from "react";

class Timer extends Component {
  formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  render() {
    const { timeRemaining } = this.props;
    return (
      <>
        <div className="timer">{this.formatTime(timeRemaining)}</div>
      </>
    );
  }
}

export default Timer;
