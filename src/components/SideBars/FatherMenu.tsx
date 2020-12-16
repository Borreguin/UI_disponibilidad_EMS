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
import { block, fatherMenu, static_menu } from "./menu_type";
import ReactTooltip from "react-tooltip";

export interface FatherPros {
  fatherMenu: fatherMenu; // Father structure
  pinned: boolean; // whether the menu is pinned or not
  // Hoocks:
  handle_close?: Function;
  handle_edited_menu?: Function;
  handle_click_menu_button?: Function;
  // Modals:
  edit_menu_modal?: Function;
  add_submenu_modal?: Function;
  edit_submenu_modal?: Function;
  delete_submenu_modal?: Function;
  // to keep track of changes
  modal_show?: boolean;
  selected_static_menu: static_menu | undefined;
  selected_block: block | undefined;
}

export interface FatherState {
  show: object;
  selected_static_menu: static_menu | undefined;
  selected_block: block | undefined;
}

class FatherMenu extends Component<FatherPros, FatherState> {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        add_submenu_modal: false,
      },
      selected_static_menu: this.props.selected_static_menu,
      selected_block: this.props.selected_static_menu,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Permite manejar el cierre y apertura de la modal
    let show = state.show;
    return { show: show };
  }

  on_click_show = (name, static_menu = undefined, block = undefined) => {
    // permite renderizar el componente
    let show = this.state.show;
    show[name] = !show[name];
    this.setState({ show: show });

    // let share information with the modals:
    if (static_menu !== undefined) {
      this.setState({ selected_static_menu: static_menu });
    }
    if (block !== undefined) {
      this.setState({ selected_block: block });
    }
    
  };

  check_if_is_active = (current_static_menu, current_block) => {
    // let to highlight the selected buton in the menu
    if (
      this.props.selected_static_menu === undefined &&
      this.props.selected_block === undefined
    ) {
      return "";
    }
    if (
      this.props.selected_static_menu.public_id ===
        current_static_menu.public_id &&
      current_block === undefined &&
      this.props.selected_block === undefined
    ) {
      return "active-menu";
    }
    if (
      this.props.selected_static_menu.public_id ===
        current_static_menu.public_id &&
      (current_block === undefined || this.props.selected_block === undefined)
    ) {
      return "";
    }
    if (
      this.props.selected_static_menu.public_id ===
        current_static_menu.public_id &&
      this.props.selected_block.public_id === current_block.public_id
    ) {
      return "active-menu";
    }
    return "";
  };

  on_click_menu_button = (e, static_menu, block = undefined) => {
    if (e.target.tagName !== "DIV" && e.target.tagName !== "SPAN") return;
    if (this.props.handle_click_menu_button !== undefined) {
      this.props.handle_click_menu_button(static_menu, block);
    }
    this.setState({ selected_static_menu: static_menu, selected_block: block });
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
                className={
                  "static_menu " +
                  this.check_if_is_active(static_menu, undefined)
                }
                data-tip={"<div>" + static_menu.name + "</div>"}
                data-html={true}
                onClick={(e) =>
                  this.on_click_menu_button(e, static_menu, undefined)
                }
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
                    {this.props.fatherMenu.static_menu.blocks.map((block) => (
                      <ListGroup.Item
                        key={block.public_id}
                        className={
                          "submenu-item " +
                          this.check_if_is_active(static_menu, block)
                        }
                        data-tip={"<div>" + block.name + "</div>"}
                        data-html={true}
                        onClick={(e) =>
                          this.on_click_menu_button(e, static_menu, block)
                        }
                      >
                        <span>
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            size="1x"
                            style={{ marginRight: "7px" }}
                          />
                        </span>
                      </ListGroup.Item>
                    ))}
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
            /* MENU PRINCIPAL */
            <Card className="container_menu">
              <Card.Header
                key={static_menu.public_id}
                className={
                  "static_menu " +
                  this.check_if_is_active(static_menu, undefined)
                }
                onClick={(e) =>
                  this.on_click_menu_button(e, static_menu, undefined)
                }
              >
                <span>
                  <FontAwesomeIcon
                    icon={
                      static_menu.icon === undefined
                        ? faPlayCircle
                        : static_menu.icon
                    }
                    style={{ marginRight: "9px" }}
                  />
                </span>
                <span className="menu-text">{static_menu.name}</span>

                <span className="right-button-section">
                  {/* Botón para añadir*/}
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    size="1x"
                    className="add_button"
                    onClick={() => this.on_click_show("add_submenu_modal", static_menu)}
                  />
                  {/* Botón de edición*/}
                  {this.props.edit_menu_modal === undefined? <></>:
                  <FontAwesomeIcon
                    icon={faPen}
                    size="1x"
                    className="edit_block_button"
                    onClick={() => this.on_click_show("edit_menu_modal", static_menu)}
                    />
                  }
                </span>
              </Card.Header>

              {/* MENU SECUNDARIO */}
              {this.props.fatherMenu.static_menu.blocks.length === 0 ? (
                <></>
              ) : (
                <Card.Body className="submenu-container">
                  <ListGroup variant="flush">
                    {/* Creando los sub-menus */}
                    {this.props.fatherMenu.static_menu.blocks.map((block) => (
                      <ListGroup.Item
                        key={block.public_id}
                        className={
                          "submenu-item " +
                          this.check_if_is_active(static_menu, block)
                        }
                        onClick={(e) =>
                          this.on_click_menu_button(e, static_menu, block)
                        }
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
                          {/* Open edit modal */}
                          <FontAwesomeIcon
                            icon={faPen}
                            size="1x"
                            className="edit_button"
                            onClick={() =>
                              this.on_click_show(
                                "edit_item_modal",
                                static_menu,
                                block
                              )
                            }
                          />
                          {/* Open delete modal */}
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="1x"
                            className="delete_button"
                            onClick={() =>
                              this.on_click_show(
                                "delete_item_modal",
                                static_menu,
                                block
                              )
                            }
                          />
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              )}
            </Card>
          }
        </div>
        {
          // Llamando modal para editar cabecera del menú
          this.state.show["edit_menu_modal"] &&
          this.props.edit_menu_modal !== undefined ? (
            this.props.edit_menu_modal(
              static_menu.public_id,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
        }

        {
          // Llamando modal para añadir elementos internos
          this.state.show["add_submenu_modal"] &&
          this.props.add_submenu_modal !== undefined ? (
            this.props.add_submenu_modal(
              this.state.selected_static_menu,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
        }

        {
          // Llamando modal para eliminar elementos internos
          this.state.show["delete_item_modal"] &&
          this.props.delete_submenu_modal !== undefined ? (
            this.props.delete_submenu_modal(
              this.state.selected_static_menu,
              this.state.selected_block,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
        }
        {
          // Llamando modal para editar elementos internos
          this.state.show["edit_item_modal"] &&
          this.props.edit_submenu_modal !== undefined ? (
            this.props.edit_submenu_modal(
              this.state.selected_static_menu,
              this.state.selected_block,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
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
