import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import Home from './Pages/Home';
import About from './Pages/About'
import SRManage from './Pages/sRemoto/SRModeling'
import SRCalDisponibilidad from './Pages/sRemoto/SRCalDisponibilidad'
import SRBackupFiles from './Pages/sRemoto/SRBackupFiles'
import SCManage from './Pages/sCentral/SCManage'
import * as serviceWorker from './serviceWorker';
import { Route,  BrowserRouter as Router} from 'react-router-dom'
import './components/icons/fontawesome'
import SRConsignaciones from './Pages/sRemoto/SRConsignaciones';
import SRModelingTags from './Pages/sRemoto/SRModelingTags';
import SRConsignacionesConsultar from './Pages/sRemoto/SRConsignacionesConsultar';

//<Route exact path="/icons" component={IconLibrary} />
const routing = (
  <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/Pages/sRemoto" component={SRManage} />
    <Route exact path="/Pages/sRemoto/Tags" component={SRModelingTags}/>
    <Route exact path="/Pages/sCentral" component={SCManage} />
    <Route exact path="/Pages/sRemoto/cal/disponibilidad" component={SRCalDisponibilidad} />
    <Route exact path="/Pages/sRemotoBackups" component={SRBackupFiles} />
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
