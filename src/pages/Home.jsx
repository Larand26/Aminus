import { Component } from "react";
import { useNavigate } from "react-router-dom";

// Components
// misc
import NavBar from "../components/misc/NavBar";
import Card from "../components/misc/Card";

// options
import pages from "../assets/json/pages.json";

import "../styles/home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
    };
  }
  logs;
  render() {
    const { navigate } = this.props;
    return (
      <div>
        <NavBar page="home" />
        <div className="home-container">
          {pages.map((page) => {
            if (page.restrition.includes(this.state.user?.roleId)) return null;
            return (
              <Card
                className="hover-card"
                key={page.page}
                icon={page.icon}
                onClick={() => navigate(page.path)}
              >
                <div className="card-container">
                  <p>{page.title}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}

const HomeWithNavigate = (props) => {
  const navigate = useNavigate();

  return <Home {...props} navigate={navigate} />;
};

export default HomeWithNavigate;
