import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import Home from './Pages/Home';
import About from './Pages/About'
import SRManage from './Pages/sRemoto/Modeling/mp_SRModeling'
import SRCalDisponibilidad from './Pages/sRemoto/CalDisponibilidad/mp_SRCalDisponibilidad'
import SRBackupFiles from './Pages/sRemoto/mp_SRBackupFiles'
import SCManage from './Pages/sCentral/Modeling/mp_SCModeling'
import * as serviceWorker from './serviceWorker';
import { Route,  BrowserRouter as Router} from 'react-router-dom'
import './components/icons/fontawesome'
import SRConsignaciones from './Pages/sRemoto/Consignaciones/mp_SRConsignaciones';
import SRModelingTags from './Pages/sRemoto/Modeling/mp_SRModelingTags';
import SRConsignacionesConsultar from './Pages/sRemoto/Consignaciones/mp_SRConsignacionesConsultar';

//<Route exact path="/icons" component={IconLibrary} />
const routing = (
  <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/Pages/sRemoto/SRmodeling" component={SRManage} />
    <Route exact path="/Pages/sRemoto/SRmodelingTags" component={SRModelingTags}/>
    <Route exact path="/Pages/sCentral" component={SCManage} />
    <Route exact path="/Pages/sRemoto/SRCalDisponibilidad" component={SRCalDisponibilidad} />
    <Route exact path="/Pages/sRemoto/SRBackupFiles" component={SRBackupFiles} />
    <Route exact path="/Pages/sRemoto/consignaciones/nueva" component={SRConsignaciones} />
    <Route exact path="/Pages/sRemoto/consignaciones/consultar" component={SRConsignacionesConsultar} />
    
     
  </Router>
)

ReactDOM.render(
  <React.StrictMode>
    {routing}
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
