import ButtonContent from "../buttons/ButtonContent.jsx";
import { Component } from "react";

import "../../styles/components/misc/content.css";

class Content extends Component {
  render() {
    const { title, timer, pages, children } = this.props;

    return (
      <div className="content">
        {title || timer ? (
          <div className="title-timer-container">
            <div className="title">{title && <p>{title}</p>}</div>
            {timer && <div className="timer">{timer}</div>}
          </div>
        ) : null}

        <div style={{ width: "100%" }} className="content-body">
          {pages ? (
            <div className="button-content-container">
              {pages.map((page, index) => (
                <ButtonContent
                  key={index}
                  icon={page.icon}
                  onClick={page.onClick}
                  className={page.className}
                />
              ))}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    );
  }
}

export default Content;
