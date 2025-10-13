import SearchButton from "./SearchButton";

import "../styles/barra-lateral.css";

const BarraLateral = (props) => {
  return (
    <div className="barra-lateral">
      {props.children}
      {props.onSearch && <SearchButton onClick={props.onSearch} />}
    </div>
  );
};

export default BarraLateral;
