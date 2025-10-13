import SearchButton from "./SearchButton";

import "../styles/barra-lateral.css";

const BarraLateral = (props) => {
  return (
    <div className="barra-lateral">
      {props.children}
      {props.search && <SearchButton />}
    </div>
  );
};

export default BarraLateral;
