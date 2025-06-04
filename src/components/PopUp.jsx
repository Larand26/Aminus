import { Button } from "primereact/button";
const PopUp = ({ children, onClose }) => {
  return (
    <div
      id="popup"
      className=" ease-in-out bg-popup fixed inset-0 flex align-items-center justify-content-center bg-black bg-opacity-50 z-50 w-full h-screen"
      style={{
        transform: "scale(0)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div className="bg-white p-6 rounded shadow-lg relative w-8 h-8 ">
        <Button
          icon="pi pi-times"
          rounded
          severity="danger"
          aria-label="Cancel"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
};

export default PopUp;
