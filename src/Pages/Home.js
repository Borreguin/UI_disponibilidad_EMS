import React, { Component } from 'react';
import '../components/css/App.css';
import DefaultNavBar from '../components/NavBars/default'
import LogoHome from '../components/Default/LogoHome'
import DefaultFooter  from '../components/NavBars/footer'
import 'bootstrap/dist/css/bootstrap.min.css'

class Home extends Component {
  state = {
    brand: { route: "/", name: "Inicio" },
        navData: [
            { route: "/route1", name: "Ruta 1" },
            { route: "/route2", name: "Ruta 2" }
        ]
  }

  render() {
    return (
      <React.Fragment>
        <DefaultNavBar
          bg="dark" variant="dark" brand={this.state.brand} navData={this.state.navData} />
        <LogoHome/>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default Home;
