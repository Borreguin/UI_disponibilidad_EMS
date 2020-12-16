import React, { Component } from "react";
import DefaultNavBar from "../../../components/NavBars/default";
import DefaultFooter from "../../../components/NavBars/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { modal_edit_root_block_function } from "./Modals/modal_edit_root_block";
import { modal_edit_root_component_function } from "./Modals/modal_edit_root_component";
import { Modal_new_root_block } from "./Modals/modal_new_root_block";
import { modal_add_internal_block_function } from "./Modals/modal_add_internal_block";
import { modal_add_root_component_function } from "./Modals/modal_add_root_component";
import { modal_edit_internal_block_function } from "./Modals/modal_edit_internal_block";
import { modal_delete_internal_block_function } from "./Modals/modal_delete_internal_block";

import { faChalkboard, faCog } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";

import DynamicSideBar from "../../../components/SideBars/dynamicSidebar";
import { modal_delete_root_component_function } from "./Modals/modal_delete_root_component";

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
    // Detects whether a root structure is needed or not
    new_root: false,
    // sidebar_menu: example_menu(),
    sidebar_menu: undefined,
    selected_static_menu: undefined,
    selected_block: undefined,
    // Estructura a convertir en el menu
    root_block: undefined,
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
    this.setState({ modal_show: update });
  };

  // convertir la estructura root block a sidebar_menu
  handle_changes_in_structure = (changed_root_block) => {
    // En caso de elemento tipo Bloque root

    let sidebar = this._root_block_to_sidebar_menu(changed_root_block, this.state.selected_static_menu, this.state.selected_block);
    this.setState({ sidebar_menu: sidebar, root_block: changed_root_block });
  };

  // manejar cuando se selecciona un botón en el menú:
  handle_click_menu_button = (selected_static_menu, selected_block) => {
    // obtener el sidebar usando los últimos cambios
    let sidebar = this._root_block_to_sidebar_menu(
      this.state.root_block,
      selected_static_menu,
      selected_block
    );
    this.setState({
      selected_static_menu: selected_static_menu,
      selected_block: selected_block,
      sidebar_menu: sidebar,
    });
  };

  // INTERNAL FUNCTIONS:
  _root_block_to_sidebar_menu = (
    r_bloque,
    selected_static_menu = undefined,
    selected_block = undefined
  ) => {
    // Sidebar contiene la estructura del menú:
    let sidebar = [];
    // Construcción de menú superior (menú de bloques)
    let first_blocks = [];
    let comp_roots = [];
    let click_inside = false;
    // creando la estructura del submenu superior e inferior:
    if (
      r_bloque["block_leafs"] !== undefined &&
      r_bloque["block_leafs"].length > 0
    ) {
      r_bloque["block_leafs"].forEach((block) => {
        let new_block = { name: block["name"], public_id: block["public_id"] };
        first_blocks.push(new_block);
        if (
          selected_block !== undefined &&
          block.public_id === selected_block.public_id
        ) {
          comp_roots = block.comp_roots;
        }
        if (
          selected_static_menu !== undefined &&
          selected_static_menu.public_id === block.public_id
        ) {
          comp_roots = block.comp_roots;
          click_inside = true;
        }
      });
    }
    // Menú Superior:
    let menu_1 = {
      header: "Bloques",
      static_menu: {
        name: r_bloque["name"],
        parent_id: r_bloque["public_id"],
        public_id: r_bloque["public_id"],
        icon: faChalkboard,
        blocks: first_blocks,
      },
    };
    sidebar.push(menu_1);

    // Construcción de menú inferior (menú de componentes)
    let second_blocks = [];
    comp_roots.forEach((comp) => {
      let new_block = { name: comp["name"], public_id: comp["public_id"] };
      second_blocks.push(new_block);
    });

    // caso en el que se da click sobre el bloque leaf
    if (
      selected_static_menu !== undefined &&
      selected_block !== undefined &&
      !click_inside
    ) {
      let menu_2 = {
        header: "Componentes",
        static_menu: {
          name: selected_block.name,
          parent_id: r_bloque["public_id"],
          public_id: selected_block.public_id,
          icon: faCog,
          blocks: second_blocks,
        },
      };
      sidebar.push(menu_2);
    }
    // caso en el que se da click sobre el componente root
    if (click_inside) {
      let menu_2 = {
        header: "Componentes",
        static_menu: {
          name: selected_static_menu.name,
          parent_id: r_bloque["public_id"],
          public_id: selected_static_menu.public_id,
          icon: faCog,
          blocks: second_blocks,
        },
      };
      sidebar.push(menu_2);
    }
    return sidebar;
  };

  _update_root_component_as_sidebar_menu = (root_component) => {
    let sidebar = this.state.sidebar_menu;
    let new_block = {
      name: root_component["name"],
      public_id: root_component["public_id"],
    };
    sidebar[1].static_menu.blocks.push(new_block);
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
          this.setState({ root_block: json.bloqueroot });
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
            // estructura del menu
            menu={this.state.sidebar_menu}
            // minimizar menú
            pinned={this.state.pinned}
            // ------ HOOCKS en cada modal
            handle_close={this.handle_modal_close}
            handle_edited_menu={this.handle_changes_in_structure}
            handle_click_menu_button={this.handle_click_menu_button}
            // ------ MENU PRINCIPAL
            // Editar el menú superior de cada menú
            edit_menu_modal={[
              modal_edit_root_block_function,
              undefined,
            ]}
            // Añadir un nuevo bloque:
            add_submenu_modal={[
              modal_add_internal_block_function,
              modal_add_root_component_function,
            ]}
            // ------ MENU SECUNDARIO
            // Editar el submenú
            edit_submenu_modal={[
              modal_edit_internal_block_function,
              modal_edit_root_component_function,
            ]}
            // Eliminar el submenú
            delete_submenu_modal={[
              modal_delete_internal_block_function,
              modal_delete_root_component_function,
            ]}
            // actualiza el estado del modal (cerrar/abrir)
            modal_show={this.state.modal_show}
            // keeps state od selected menu and block
            selected_static_menu={this.state.selected_static_menu}
            selected_block={this.state.selected_block}
          />
          {
            // permite desplegar el model de inicio de modelación
            this.state.new_root ? (
              <Modal_new_root_block
                public_id={this.state.root_public_id}
                handle_close={this.handle_modal_close}
                handle_new_root_block={this.handle_changes_in_structure}
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
