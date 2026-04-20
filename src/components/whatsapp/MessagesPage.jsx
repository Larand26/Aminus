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
import tableOptions from "../../assets/json/table_options/messagesOptions.json";

// misc
import ProgressBar from "../misc/ProgressBar";

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
      onSendMessages = () => {},
      sending = false,
      progress = { total: 0, current: 0 },
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
              onSelectionChange={(data) => onSelectionChange(data)}
              selectedItems={contactsSelected}
              maxHeight={"250px"}
            />
            <ProgressBar total={progress.total} current={progress.current} />
            <Button
              text="Enviar"
              className="btn-send"
              onClick={() => onSendMessages()}
              disabled={sending}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MessagePage;
