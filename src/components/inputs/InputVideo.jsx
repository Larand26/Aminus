import React, { Component, createRef } from "react";
import "../../styles/components/inputs/input-video.css";

class InputVideo extends Component {
  static defaultProps = {
    videos: [],
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  handleFileChange = (event) => {
    const { videos, onChange } = this.props;
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const videoUrl = URL.createObjectURL(file);

      // Read file as ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;

        // Manually extract file properties into a plain object
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };

        const newVideoObj = { url: videoUrl, buffer: buffer, file: fileData };
        const updatedVideos = [...videos, newVideoObj];
        onChange(updatedVideos);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  handleContainerClick = (e) => {
    // Avoid infinite loop if click originates from the input itself
    if (e.target.tagName === "INPUT") return;
    this.inputRef.current.click();
  };

  handleInputClick = (e) => {
    e.stopPropagation();
    e.target.value = null;
  };

  handleDeleteVideo = (e, index) => {
    e.stopPropagation();
    const { videos, onChange } = this.props;
    const updatedVideos = videos.filter((_, i) => i !== index);
    onChange(updatedVideos);
  };

  render() {
    const { videos } = this.props;

    return (
      <div className="input-video" onClick={this.handleContainerClick}>
        <input
          type="file"
          multiple={true}
          accept="video/mp4, video/quicktime, .mov"
          onChange={this.handleFileChange}
          onClick={this.handleInputClick}
          ref={this.inputRef}
          style={{ display: "none" }}
        />
        {videos.length > 0 && (
          <>
            {videos.map((videoObj, index) => (
              <div key={index} className="video-preview">
                <video controls onClick={(e) => e.stopPropagation()}>
                  <source src={videoObj.url} type="video/mp4" />
                  <source src={videoObj.url} type="video/quicktime" />
                  <source src={videoObj.url} type="video/x-m4v" />
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={(e) => this.handleDeleteVideo(e, index)}
                  className="button-delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}

export default InputVideo;
