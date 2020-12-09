import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import example_menu from "./SideBar";
import { Modal_edit_root_block, modal_edit_root_block_function } from "./Modals/modal_edit_root_block";
import { Modal_new_root_block } from "./Modals/modal_new_root_block";
import { Modal_add_internal_block, modal_add_internal_block_function } from "./Modals/modal_add_internal_block";
import { Modal_add_root_component } from "./Modals/modal_add_root_component";
import { Modal_edit_internal_block } from "./Modals/modal_edit_internal_block";
import { Modal_edit_root_component } from "./Modals/modal_edit_root_component";
import { Modal_delete_internal_block } from "./Modals/modal_delete_internal_block";
import { Modal_delete_root_component } from "./Modals/modal_delete_root_component";

import {
  faChalkboard,
  faCog,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import "../styles.css";

import DynamicSideBar from "../../../components/SideBars/dynamicSidebar";

// Pagina inicial de manejo de nodos:
class SCManage extends Component {
  /* Configuración de la página: */
  state = {
    brand: { route: "/Pages/sCentral", name: "Sistema Central" },
    root_public_id: "disponibilidad_ems",
    navData: [],
    loading: true,
    msg: "",
    error: false,
    pinned: false,
    modal_show: false,
    new_root: false,
    // sidebar_menu: example_menu(),
    sidebar_menu: undefined,
  };

  async componentDidMount() {
    this._search_root_block();
  }

  // HOOKS SECTION:
  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

  // manejar el cierre de los modales:
 handle_modal_close = (name, update) => {
    // let update_modal_show_state = this.state.modal_show;
    // update_modal_show_state[name] = update;
    // console.log(update_modal_show_state);
    console.log("ya cerrado");
    this.setState({ modal_show: update });
  };

  // convertir la estructura root block a sidebar_menu
  handle_changes_in_root = (r_bloque) => {
    let sidebar = this._root_block_to_sidebar_menu(r_bloque);
    this.setState({ sidebar_menu: sidebar });
  };

  // INTERNAL FUNCTIONS:
  _root_block_to_sidebar_menu = (r_bloque) => {
    console.log("me", r_bloque);
    let blocks = [];
    if (
      r_bloque["blockleafs"] !== undefined &&
      r_bloque["blockleafs"].length > 0
    ) {
      r_bloque["blockleafs"].forEach((block) => {
        console.log("me changing", block);
        let new_block = { name: block["name"], public_id: block["public_id"] };
        console.log(new_block);
        blocks.push(new_block);
      });
    }
    let sidebar = [
      {
        header: "Administración",
        static_menu: {
          name: r_bloque["name"],
          public_id: r_bloque["public_id"],
          icon: faChalkboard,
          blocks: blocks,
        },
      },
    ];
    return sidebar;
  };

  _search_root_block = async () => {
    this.setState({
      sidebar_menu: undefined,
      loading: true,
      error: false,
    });
    let path = "/api-sct/block-root/" + this.state.root_public_id;
    let sidebar = undefined;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          sidebar = this._root_block_to_sidebar_menu(json.bloqueroot);
        } else {
          this.setState({
            new_root: true,
            msg: "Es necesario crear un bloque principal para esta página",
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          msg: "Ha fallado la conexión con la API de modelamiento (api-sct)",
        });
        console.log(error);
      });
    this.setState({ loading: false, sidebar_menu: sidebar });
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
            // ------ HOOCKS en cada modal
            handle_close={this.handle_modal_close}
            handle_edited_menu={this.handle_changes_in_root}
            // ------ MENU PRINCIPAL
            // Editar el menú superior de cada menú
            edit_menu_modal={[
              modal_edit_root_block_function,
              modal_edit_root_block_function
            ]}
            // Añadir un nuevo bloque:
            add_submenu_modal={[
              modal_add_internal_block_function,
              modal_add_internal_block_function
            ]}
            // ------ MENU SECUNDARIO
            // Editar el submenú
            edit_submenu_modal={[
              <Modal_edit_internal_block
                handle_close={this.handle_modal_close}
              />,
              <Modal_edit_root_component
                handle_close={this.handle_modal_close}
              />,
            ]}
            // eliminar el submenú
            delete_submenu_modal={[
              <Modal_delete_internal_block
                handle_close={this.handle_modal_close}
              />,
              <Modal_delete_root_component
                handle_close={this.handle_modal_close}
              />,
            ]}
            // actualiza el estado del modal (cerrar/abrir)
            modal_show={this.state.modal_show}
          />
          {
            // permite desplegar el model de inicio de modelación
            this.state.new_root ? (
              <Modal_new_root_block
                public_id={this.state.root_public_id}
                handle_close={this.handle_modal_close}
                handle_new_root_block={this.handle_changes_in_root}
              />
            ) : (
              <></>
            )
          }
          <div className="page-content content-shift">
            <div>Hello world</div>
          </div>
        </div>

        <DefaultFooter />
      </React.Fragment>
    );
  }
}

export default SCManage;
