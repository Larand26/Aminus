import { Component, createRef } from "react";

import "../../styles/components/inputs/input-photo.css";

import Utils from "../../utils/utils";

class InputPhoto extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = createRef();
  }

  // Onchange do input de arquivo
  handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map((file) => Utils.convertLocalFileToBase64(file))).then(
      (base64Array) => {
        this.props.onChange([...this.props.photos, ...base64Array]);
      },
    );
    e.target.value = null;
  };

  // OnDrag e OnDrop para arrastar e soltar arquivos
  handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    Promise.all(files.map((file) => Utils.convertLocalFileToBase64(file))).then(
      (base64Array) => {
        const completePhotos = [...this.props.photos, ...base64Array];
        const uniquePhotos = completePhotos.filter((photo, index) => {
          return completePhotos.indexOf(photo) === index;
        });
        this.props.onChange(uniquePhotos);
      },
    );
  };

  // Muda fotos de posição
  movePhoto = (fromIndex, toIndex) => {
    const photos = [...this.props.photos];
    const photo = photos.splice(fromIndex, 1)[0];
    photos.splice(toIndex, 0, photo);
    this.props.onChange(photos);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.photos !== this.props.photos) {
      console.log(this.props.photos);
    }
  }

  render() {
    const { photos = [], onChange = () => {} } = this.props;
    return (
      <div
        className="input-photo"
        onClick={() => this.fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this.handleDrop(e)}
      >
        {/* Exibe as fotos selecionadas */}
        {photos.map((photo, index) => (
          <div key={index} className="photo-preview-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(photos.filter((_, i) => i !== index));
              }}
              className="delete-photo-button"
            >
              <i className="fas fa-trash"></i>
            </button>
            <img
              key={index}
              src={photo}
              alt={`Foto ${index + 1}`}
              className="photo-preview"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.movePhoto(index, index - 1);
              }}
              className="left"
            >
              <i className="fas fa-angle-left"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.movePhoto(index, index + 1);
              }}
              className="right"
            >
              <i className="fas fa-angle-right"></i>
            </button>
          </div>
        ))}

        {/* Input de arquivo oculto */}
        <input
          ref={this.fileInputRef}
          type="file"
          multiple
          onChange={(e) => this.handleFileChange(e)}
        />
      </div>
    );
  }
}

export default InputPhoto;
