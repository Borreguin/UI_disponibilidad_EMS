import React, { Component } from 'react';
import DefaultNavBar from '../components/NavBars/default'
//import LogoHome from '../components/Default/LogoHome'
import DefaultFooter from '../components/NavBars/footer'

class About extends Component {
  state = {
    brand: { route: "./", name: "Acerca de este desarrollo" },
    navData: []
  }
  
  render() {
    
    return (
      <React.Fragment>
        <DefaultNavBar
          bg="dark" variant="dark" brand={this.state.brand} navData={this.state.navData} />
        <h3 style={{padding:"2%"}}> Gerencia de Desarrollo Técnico - 2020 </h3>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default About;



