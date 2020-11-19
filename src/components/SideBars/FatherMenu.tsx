import React, { Component, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faEdit,
  faPaperclip,
  faPen,
  faPlayCircle,
  faPlus,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import "./css/styles.css";
import { fatherMenu } from "./menu_type";
import ReactTooltip from "react-tooltip";

export interface FatherPros {
  fatherMenu: fatherMenu; // Father structure
  pinned: boolean; // whether the menu is pinned or not
  add_submenu_modal?: Component;
  edit_submenu_modal?: Component;
  delete_submenu_modal?: Component;
  modal_show?: boolean;
}

export interface FatherState {
  show: object;
}

/*
Ex:
fatherMenu = {
  header: "Modelamiento",
  static_menu: "Bloque EMS"
}
*/

class FatherMenu extends Component<FatherPros, FatherState> {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        add_submenu_modal: false,
      },
      show_all: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Permite manejar el cierre y apertura de la modal
    let modal_id = [
      "add_submenu_modal",
      "edit_item_modal",
      "delete_item_modal",
    ];
    modal_id.forEach((id) => {
      if (this.state.show[id] !== this.props.modal_show) {
        let show = this.state.show;
        show[id] = this.props.modal_show;
        this.setState({
          show: show,
        });
      }
    });
  }

  on_click_show = (name) => {
    // permite renderizar el componente
    let show = this.state.show;
    show[name] = !show[name];
    this.setState({ show: show });
  };

  on_click_menu_button = (e, sub_menu=undefined) => {
    let clicked_button = {
      menu: this.props.fatherMenu.public_id,
      submenu: sub_menu,
    };
    console.log(clicked_button);
  };

  // menu minimizado
  pinned_menu = (header, static_menu) => {
    let _ = require("lodash");
    // si el submenú no esta definido totalmente, entonces no se presenta
    if (header === undefined || static_menu.name === undefined) {
      return <></>;
    }
    // caso contrario se presenta el menú
    return (
      <ul>
        <div className="hm-pinned">
          {String(header).toUpperCase().substring(0, 3)}
        </div>
        <div className="pinned_button">
          {
            <Card className="container_menu">
              <Card.Header
                key={_.uniqueId("id_pinned")}
                className="static_menu"
                data-tip={"<div>" + static_menu.name + "</div>"}
                data-html={true}
                onClick={this.on_click_menu_button}
              >
                <span style={{ marginLeft: "10px" }}>
                  <FontAwesomeIcon
                    icon={
                      static_menu.icon === undefined
                        ? faPlayCircle
                        : static_menu.icon
                    }
                  />
                </span>
              </Card.Header>
              <ReactTooltip />
              {this.props.fatherMenu.static_menu.blocks.length === 0 ? (
                <></>
              ) : (
                <Card.Body className="submenu-container">
                  <ListGroup variant="flush">
                    {this.props.fatherMenu.static_menu.blocks.map(
                      (block) => (
                        <ListGroup.Item
                          key={block.public_id}
                          className="submenu-item"
                          data-tip={"<div>" + block.name + "</div>"}
                          data-html={true}
                          onClick={ (e)=> this.on_click_menu_button(e, block.public_id)}
                        >
                          <span>
                            <FontAwesomeIcon
                              icon={faCaretRight}
                              size="1x"
                              style={{ marginRight: "7px" }}
                            />
                          </span>
                        </ListGroup.Item>
                      )
                    )}
                    <ReactTooltip />
                  </ListGroup>
                </Card.Body>
              )}
            </Card>
          }
        </div>
      </ul>
    );
  };

  // menu extendido
  toggled_menu = (header, static_menu) => {
    let _ = require("lodash");

    // si el submenú no esta definido totalmente, entonces no se presenta
    if (header === undefined || static_menu.name === undefined) {
      return <></>;
    }
    // caso contrario se presenta el menú
    return (
      <ul>
        <div className="header-menu">
          <span>{header}</span>
        </div>
        <div className="sidebar-submenu ">
          {
            <Card className="container_menu">
              <Card.Header
                key={_.uniqueId("id_toogle")}
                className="static_menu"
                onClick={this.on_click_menu_button}
              >
                <span>
                  <FontAwesomeIcon
                    icon={
                      static_menu.icon === undefined
                        ? faPlayCircle
                        : static_menu.icon
                    }
                    style={{ marginRight: "10px" }}
                  />
                </span>
                <span className="menu-text">{static_menu.name}</span>

                <span
                  className="add_button"
                  onClick={() => this.on_click_show("add_submenu_modal")}
                >
                  <FontAwesomeIcon icon={faPlusCircle} size="lg" />
                </span>
              </Card.Header>
              {this.props.fatherMenu.static_menu.blocks.length === 0 ? (
                <></>
              ) : (
                <Card.Body className="submenu-container">
                  <ListGroup variant="flush">
                    {this.props.fatherMenu.static_menu.blocks.map(
                      (block) => (
                        <ListGroup.Item key={block.public_id} className="submenu-item"
                        onClick={ (e)=> this.on_click_menu_button(e, block.public_id)}
                        >
                          <span style={{ marginRight: "15px" }}>&middot;</span>
                          <span>
                            {block.name.length > 30
                              ? block.name.substring(0, 20) +
                                "..." +
                                block.name.substring(
                                  block.name.length - 5,
                                  block.name.length
                                )
                              : block.name}
                          </span>
                          <span className="right-button-section">
                            <FontAwesomeIcon
                              icon={faPen}
                              size="1x"
                              className="edit_button"
                              onClick={() =>
                                this.on_click_show("edit_item_modal")
                              }
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="1x"
                              className="delete_button"
                              onClick={() =>
                                this.on_click_show("delete_item_modal")
                              }
                            />
                          </span>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </Card.Body>
              )}
            </Card>
          }
        </div>
        {
          // Llamando modal para añadir elementos internos
          this.state.show["add_submenu_modal"] &&
          this.props.add_submenu_modal !== undefined ? (
            this.props.add_submenu_modal
          ) : (
            <></>
          )
        }

        {
          // Llamando modal para eliminar elementos internos
          this.state.show["delete_item_modal"] &&
          this.props.delete_submenu_modal !== undefined ? (
            this.props.delete_submenu_modal
          ) : (
            <></>
          )
        }
        {
          // Llamando modal para editar elementos internos
          this.state.show["edit_item_modal"] &&
          this.props.edit_submenu_modal !== undefined ? (
            this.props.delete_submenu_modal
          ) : (
            <></>
          )
        }
      </ul>
    );
  };

  render() {
    const { fatherMenu, pinned } = this.props;
    return pinned
      ? this.pinned_menu(fatherMenu.header, fatherMenu.static_menu)
      : this.toggled_menu(fatherMenu.header, fatherMenu.static_menu);
  }
}
export default FatherMenu;
