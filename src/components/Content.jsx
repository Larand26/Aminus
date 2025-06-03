const Content = ({ children, titulo }) => {
  return (
    <div className="content flex flex-column align-items-center justify-content-center w-full min-h-screen bg-gray-200 p-4">
      <div className="titulo">
        <p>{titulo ? titulo : "Título Padrão"}</p>
      </div>
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
};
export default Content;
