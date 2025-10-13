import "../styles/search-button.css";

const SearchButton = (props) => {
  return (
    <button className="search-button" onClick={props.onClick}>
      <span>Pesquisar</span>
      <i className="fas fa-search"></i>
    </button>
  );
};

export default SearchButton;
