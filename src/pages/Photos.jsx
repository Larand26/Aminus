import { Component } from "react";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import SideBar from "../components/misc/SideBar";
import Content from "../components/misc/Content";
import Card from "../components/misc/Card";

// buttons
import ActionButtons from "../components/buttons/ActionButtons";

// inputs
import InputText from "../components/inputs/InputText";

// styles
import "../styles/pages/photos.css";

// sem imagem
import unknown from "../assets/img/unknown.jpg";

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsData: [],
      manufacturerCode: null,
      colorCode: null,
    };
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="main-container">
          <SideBar>
            <InputText
              label="Código de fabricante"
              value={this.state.manufacturerCode}
              onChange={(value) => this.setState({ manufacturerCode: value })}
            />
            <InputText
              label="Código da cor"
              value={this.state.colorCode}
              onChange={(value) => this.setState({ colorCode: value })}
            />
          </SideBar>
          <Content title="Fotos">
            <div className="fotos-container"></div>
          </Content>
        </div>
      </>
    );
  }
}

export default Photos;
