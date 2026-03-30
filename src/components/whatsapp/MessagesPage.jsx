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
    const {} = this.props;
    return (
      <div className="messagespage-container">
        <InputPhoto />
        <div className="messagespage-main-container">
          <div>
            <TextArea />
          </div>
          <div className="messagespage-table-actions">
            <Table options={tableOptions} datas={[]} />
            <Button text="Enviar" className="btn-send" />
          </div>
        </div>
      </div>
    );
  }
}

export default MessagePage;
