const Content = ({ children, titulo }) => {
  return (
    <div className="ml-13rem content flex flex-column align-items-center justify-content-center w-full mh-screen bg-gray-200 p-4">
      <div className="titulo">
        <p>{titulo ? titulo : "Título Padrão"}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default Content;
