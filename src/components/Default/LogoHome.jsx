import React from 'react';
import logo from '../images/logo.jpg'

function LogoHome() { 

    return (
        <div className="App">
          <div style={{ padding: "7.5%" }}>
            <img src={logo} alt="Logo de CENACE"></img>
            <p></p>
            <h1>
              Operador Nacional de Electricidad
          </h1>
            <h1>
              CENACE
          </h1>
          </div>
        </div>
    );

}
export default LogoHome;