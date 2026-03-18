import { useEffect, useState } from "react";

import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import InputLabel from "../components/InputLabel";
import CheckBox from "../components/CheckBox";
import Card from "../components/Card";
import BotoesFotos from "../components/BotoesFotos";
import PopUp from "../components/PopUp";
import PopUpEditarFoto from "../components/popups/PopUpEditarFoto";
import Loading from "../components/Loading";
import Toast from "../components/Toast";
import Content from "../components/Content";

import searchPhotos from "../utils/search/searchFotos";
import updatePhotoMongo from "../utils/fotos/atualizaFotoMongo";
import createPhotoMongo from "../utils/fotos/cadastraFotoMongo";
import deletePhoto from "../utils/fotos/deletaFoto";
import downloadPhotos from "../utils/fotos/baixaFotos";

import unknown from "../assets/img/unknown.jpg";

import "../styles/fotos.css";

const Photos = () => {
  // Input states
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [colorCode, setColorCode] = useState("");

  // Toast
  const [toastInfo, setToastInfo] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Photos
  const [photos, setPhotos] = useState([]);

  // Pop up
  const [isPhotosPopupOpen, setIsPhotosPopupOpen] = useState(false);

  const handleSearch = async () => {
    setPhotos([]);
    setIsLoading(true);
    const filters = {
      codFabricante: manufacturerCode,
      codInterno: internalCode,
      codCor: colorCode,
    };
    const response = await searchPhotos(filters);

    if (response.success) {
      if (response.data.length === 0) {
        setToastInfo({
          key: Date.now(),
          message: "No photos found",
          type: "aviso",
        });
      }
      setPhotos(response.data);
    } else {
      setToastInfo({
        key: Date.now(),
        message: response.error || "Error while searching photos",
        type: "falha",
      });
      setPhotos([]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Filter
  const [filter, setFilter] = useState("");
  const filterPhotos = () => {
    return photos.filter(
      (foto) =>
        foto.nome_cor?.toLowerCase().includes(filter.toLowerCase()) ||
        foto.codigo_cor?.toLowerCase().includes(filter.toLowerCase()),
    );
  };

  // PopUp
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openEditPopup = (photo) => {
    setSelectedPhoto(photo);
    setIsPhotosPopupOpen(true);
  };

  // Receives edited data when popup closes
  const handleCloseAndSave = async (updatedPhoto) => {
    if (!updatedPhoto || Object.keys(updatedPhoto).length === 0) return;

    // Existing _id means update flow
    if (updatedPhoto._id) {
      setPhotos((previousPhotos) =>
        previousPhotos.map((photo) =>
          photo._id === updatedPhoto._id ? updatedPhoto : photo,
        ),
      );

      const result = await updatePhotoMongo(updatedPhoto);
      console.log(result);
      return;
    }

    // Otherwise create a new photo and prepend locally
    const result = await createPhotoMongo(updatedPhoto);
    console.log("Photo create result:", result);

    if (result && (result.success || result.error !== true)) {
      // Fallback local id when backend does not return _id
      const tempId = `_local_${Date.now()}`;
      const newPhoto = { ...updatedPhoto, _id: result.id || tempId };
      setPhotos((prev) => [newPhoto, ...prev]);

      setToastInfo({
        key: Date.now(),
        message: result.message || "Photo created successfully.",
        type: result.success ? "sucesso" : "aviso",
      });
    } else {
      setToastInfo({
        key: Date.now(),
        message: result?.message || "Error while creating photo.",
        type: "falha",
      });
    }
  };

  // Delete photo
  const handleDeletePhoto = async (photoId) => {
    if (!photoId) return;

    const result = await deletePhoto(photoId);
    console.log("Delete result:", result);
    if (result.success) {
      const updatedPhotos = photos.filter((photo) => photo._id !== photoId);
      setPhotos(updatedPhotos);
    }
  };

  // Download photos
  const [selectedPhotosDownload, setSelectedPhotosDownload] = useState([]);
  const allSelected =
    photos.length > 0 && selectedPhotosDownload.length === photos.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPhotosDownload([]);
    } else {
      setSelectedPhotosDownload(photos);
    }
  };

  const handleDownloadPhotos = async (photo, reference) => {
    if (photo) {
      const result = await downloadPhotos([photo], reference);
    } else {
      const result = await downloadPhotos(selectedPhotosDownload, reference);
    }
  };

  // Select photo for download
  const selectPhoto = (photo) => {
    if (!photo) return;

    const isSelected = selectedPhotosDownload.some((f) => f._id === photo._id);

    if (isSelected) {
      setSelectedPhotosDownload((prev) =>
        prev.filter((f) => f._id !== photo._id),
      );
    } else {
      setSelectedPhotosDownload((prev) => [...prev, photo]);
    }
  };

  return (
    <>
      <PopUp
        id="editar-foto"
        onClose={() => {
          setSelectedPhoto(null);
          setIsPhotosPopupOpen(false);
        }}
        width="80%"
        height="700px"
        open={isPhotosPopupOpen}
      >
        {/* Renders editor only when a photo is selected */}
        {selectedPhoto && (
          <PopUpEditarFoto
            foto={selectedPhoto}
            onCloseAndSave={handleCloseAndSave}
          />
        )}
      </PopUp>
      <NavBar />
      {toastInfo && (
        <Toast
          key={toastInfo.key}
          message={toastInfo.message}
          type={toastInfo.type}
        />
      )}
      <div className="main-container">
        <SideBar onSearch={handleSearch}>
          <InputLabel
            label="Manufacturer Code"
            value={manufacturerCode}
            onChange={setManufacturerCode}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Internal Code"
            value={internalCode}
            onChange={setInternalCode}
            onKeyDown={handleKeyDown}
          />
          <InputLabel
            label="Color Code"
            value={colorCode}
            onChange={setColorCode}
            onKeyDown={handleKeyDown}
          />
        </SideBar>
        <Content titulo="Photos">
          <div className="container-fotos">
            <div className="navBar-fotos">
              <div>
                <input
                  type="text"
                  className="filtro-fotos"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <CheckBox
                  id="foto1"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <button
                  className="btn-baixar-foto"
                  onClick={() => handleDownloadPhotos(null, null)}
                >
                  Download Photos
                  <i className="fa fa-download"></i>
                </button>
              </div>
              <div>
                <button
                  className="btn-adicionar-foto"
                  onClick={() => openEditPopup({})}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="content-fotos">
              <div className="fotos">
                {isLoading && <Loading />}
                {filterPhotos().map((foto, index) => {
                  const isSelected = selectedPhotosDownload.some(
                    (f) => f._id === foto._id,
                  );
                  return (
                    <Card
                      onClick={() => selectPhoto(foto)}
                      className={`card-foto${
                        isSelected ? " card-selected" : ""
                      }`}
                      key={index}
                      foto={
                        foto?.fotos[0]
                          ? `data:image/jpeg;base64,${foto?.fotos[0]}`
                          : unknown
                      }
                    >
                      <BotoesFotos
                        foto={foto}
                        data={index + 1}
                        onConfirmDelete={() => handleDeletePhoto(foto._id)}
                        onEditClick={() => {
                          openEditPopup(foto);
                          setIsPhotosPopupOpen(true);
                        }}
                        onDownloadClick={() =>
                          handleDownloadPhotos(foto, foto.referencia)
                        }
                      />
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </Content>
      </div>
    </>
  );
};

export default Photos;
