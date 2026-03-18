import { Component } from "react";

import "../../styles/components/buttons/action-buttons.css";

import Button from "./Button";

class ActionButtons extends Component {
  state = {
    showConfirmDelete: false,
  };
  toggleConfirmDelete = () => {
    this.setState((prevState) => ({
      showConfirmDelete: !prevState.showConfirmDelete,
    }));
  };
  openConfirmDelete = () => {
    this.setState({ showConfirmDelete: true });
  };
  closeConfirmDelete = () => {
    this.setState({ showConfirmDelete: false });
  };
  render() {
    const {
      onEdit,
      onDelete,
      onDownload,
      confirmDeleteText = "Tem certeza que deseja excluir este item?",
    } = this.props;
    return (
      <div className="action-buttons">
        <div className="buttons-container">
          {onEdit && (
            <Button onClick={onEdit} icon="fa-solid fa-pen-to-square" />
          )}
          {onDownload && (
            <Button onClick={onDownload} icon="fa-solid fa-download" />
          )}
          {onDelete && (
            <Button
              className="delete-button"
              onClick={this.toggleConfirmDelete}
              icon="fa-solid fa-trash"
            />
          )}
        </div>
        <div
          className={`confirm-delete ${this.state.showConfirmDelete ? "visible" : "hidden"}`}
        >
          <p>{confirmDeleteText}</p>
          <div className="buttons-container">
            <Button
              onClick={() => {
                this.closeConfirmDelete();
                onDelete();
              }}
              text="Sim"
              className="confirm-button"
            />
            <Button
              onClick={this.closeConfirmDelete}
              text="Não"
              className="cancel-button"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ActionButtons;
