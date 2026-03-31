import { Component } from "react";

// Components
// misc

// inputs
import InputPhoto from "../inputs/InputPhoto";
import TextArea from "../inputs/TextArea";

// buttons
import Button from "../buttons/Button";

// table
import Table from "../table/Table";

// options
import tableOptions from "../../assets/json/table_options/messagesOptions";

// styles
import "../../styles/pages/messagespage.css";

class MessagePage extends Component {
  render() {
    const {
      photos = [],
      onChangePhotos = () => {},
      message = "",
      onChangeMessage = () => {},
      contactsData = [],
      contactsSelected = [],
      onSelectionChange = () => {},
    } = this.props;
    return (
      <div className="messagespage-container">
        <InputPhoto
          photos={photos}
          onChange={(photos) => onChangePhotos(photos)}
        />
        <div className="messagespage-main-container">
          <div>
            <TextArea
              value={message}
              onChange={(message) => onChangeMessage(message)}
            />
          </div>
          <div className="messagespage-table-actions">
            <Table
              options={tableOptions}
              datas={contactsData}
              onSelectionChange={onSelectionChange}
              selectedItems={contactsSelected}
            />
            <Button text="Enviar" className="btn-send" />
          </div>
        </div>
      </div>
    );
  }
}

export default MessagePage;
