import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import "bootstrap/dist/css/bootstrap.min.css";

import static_menu from "./SideBar";
import { Modal_add_block } from "./modal_add_block";
import { Modal_add_component } from "./modal_add_component";
import { Modal_edit_block } from "./modal_edit_block";
import { Modal_edit_component } from "./modal_edit_component";
import { Modal_delete_block } from "./modal_delete_block";
import { Modal_delete_component } from "./modal_delete_component";

import { faChalkboard, faCog, faTools } from "@fortawesome/free-solid-svg-icons";


import DynamicSideBar from "../../../components/SideBars/dynamicSidebar";

// Pagina inicial de manejo de nodos:
class SCManage extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sCentral", name: "Sistema Central" },
    navData: [],
    loading: true,
    msg: "",
    error: false,
    pinned: false,
    modal_show: false,
    sidebar_menu: static_menu()
  };

  async componentDidMount() {
    this._search_root_block();
  }

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

  // manejar el cierre de los modales:
  handle_modal_close = (name, update) => {
    // let update_modal_show_state = this.state.modal_show;
    // update_modal_show_state[name] = update;
    // console.log(update_modal_show_state);
    this.setState({ modal_show: update });
  };

  _search_root_block = async () => {
    this.setState({ sidebar_menu: static_menu(), loading: true, error: false });
    // TODO: retirar esta parte una vez realizado lo puesto /* */
    /*
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        // TODO: realizar lo necesario 
      })
      .catch((error) => { 
        this.setState({ error: true, msg: "Ha fallado la conexión con la API de modelamiento (api-sct)" });
        console.log(error);
      });*/
    let sidebar_menu = [  {
      header: "Admininistración:",
      public_id: "modelamiento_ems",
      static_menu: {
        name: "Modelamiento EMS",
        icon: faChalkboard,
        blocks: [{ name: "Block 1", public_id:"block1_id"}, {name: "Block 2", public_id:"block2_id"}]
      },
    },
    {
      header: "Componentes:",
      public_id: "dsdfdsfasd",
      static_menu: {
        name: "Block 1",
        icon: faCog,
        blocks: []
      },
      
    }]
    this.setState({ loading: false, sidebar_menu: sidebar_menu});
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <React.Fragment>
        <DefaultNavBar
          bg="dark"
          variant="dark"
          brand={this.state.brand}
          navData={this.state.navData}
          showpinned={true}
          onClickBtnPin={this.handle_onClickBtnPin}
        />
        <div
          className={
            this.state.pinned
              ? "page-wrapper default-theme sidebar-bg bg1 toggled pinned"
              : "page-wrapper default-theme sidebar-bg bg1 toggled"
          }
        >
          <DynamicSideBar
            menu={this.state.sidebar_menu} // menú estático
            pinned={this.state.pinned} // minimizar menú
            // permite manejar el modal de añadir en cada submenú
            add_submenu_modal={[
              <Modal_add_block handle_close={this.handle_modal_close} />,
              <Modal_add_component handle_close={this.handle_modal_close} />,
            ]}
            edit_submenu_modal={[
              <Modal_edit_block handle_close={this.handle_modal_close} />,
              <Modal_edit_component handle_close={this.handle_modal_close} />,
            ]}
            delete_submenu_modal={[
              <Modal_delete_block handle_close={this.handle_modal_close} />,
              <Modal_delete_component handle_close={this.handle_modal_close} />,
            ]}

            modal_show={this.state.modal_show} // actualiza el estado del modal (cerrar/abrir)
          />
          <div className="page-content"></div>
        </div>
        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SCManage;
