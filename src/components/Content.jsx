import ButtonContent from "./ButtonContent";

import "../styles/content.css";

const Content = (props) => {
  return (
    <div className="content">
      <div className="titulo-timer-container">
        <div className="titulo">
          <p>{props.titulo ? props.titulo : "Título Padrão"}</p>
        </div>
        {props.timer && <div className="timer">{props.timer}</div>}
      </div>

      <div style={{ width: "100%" }} className="content-body">
        {props.pages ? (
          <div className="button-content-container">
            {props.pages.map((page, index) => (
              <ButtonContent
                key={index}
                icon={page.icon}
                onClick={page.onClick}
              />
            ))}
          </div>
        ) : null}
        {props.children}
      </div>
    </div>
  );
};
export default Content;
