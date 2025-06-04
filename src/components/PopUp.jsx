const PopUp = ({ children, onClose }) => {
  return (
    <div className="bg-popup fixed inset-0 flex align-items-center justify-content-center bg-black bg-opacity-50 z-50 w-full h-screen">
      <div className="bg-white p-6 rounded shadow-lg relative w-8 h-8">
        <button
          onClick={onClose}
          className="absolute text-gray-500 hover:text-gray-700"
          style={{
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default PopUp;
