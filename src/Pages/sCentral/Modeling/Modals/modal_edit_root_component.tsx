import React, { Component, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { block, static_menu } from "../../../../components/SideBars/menu_type";
import { root_block_form, root_component_form } from "../../types";
export interface add_menu_props {
  static_menu: static_menu;
  block: block;
  handle_close?: Function;
  handle_message?: Function;
  handle_edited_root_block?: Function;
}

export interface add_menu_state {
  show: boolean;
  form: root_component_form;
  message: string;
}

let modal_id = "Modal_edit_root_component";

export class Modal_edit_root_component extends Component<
  add_menu_props,
  add_menu_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      form: { name: undefined },
      message: "",
    };
  }
  // HOOKS SECTION:
  handleClose = () => {
    // actualizo el estado local
    this.setState({ show: false });
    if (this.props.handle_close !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_close(modal_id, false);
    }
  };

  handleMessages = (message) => {
    if (this.props.handle_message !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_message(modal_id, message);
    }
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleEditedRootBlock = (bloqueroot) => {
    if (this.props.handle_edited_root_block !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_block(bloqueroot);
    }
  };

  // INTERNAL FUNCTIONS:
  // Edita un componente root mediante: id del bloque root, id del bloque leaf e id del componente
  _onclick_edit = () => {
    if (this._check_form()) {
      let path =
        "/api-sct/component-root/block-root/" + this.props.static_menu.parent_id +
        "/block-leaf/" + this.props.static_menu.public_id +
        "/comp-root/" + this.props.block.public_id;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Editando el componente" });
      // Creando el nuevo root block mediante la API
      fetch(path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.handleEditedRootBlock(json.bloqueroot);
            //this.handleClose();
          } else {
            this.setState({ message: json.msg });
            this.handleMessages(json.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          let msg =
            "Ha fallado la conexión con la API de modelamiento (api-sct)";
          this.setState({ message: msg });
          this.handleMessages(msg);
        });
    }
  };

  _handle_form_changes = (e, field) => {
    this.setState({ message: "" });

    let form = this.state.form;
    form[field] = e.target.value;
    this.setState({ form: form });
    if (!this._check_form()) {
      this.setState({
        message: "Se debe ingresar valores con mínimo 4 caracteres",
      });
    }
  };

  _check_form = () => {
    let fields = ["name"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.form[f] !== undefined &&
        this.state.form[f].length > 4;
    });
    return valid;
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Editar configuraciones de este componente
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="EditBlockName">
                <Form.Label>Cambiar el nombre de este componente:</Form.Label>
                <Form.Control
                  onChange={(e) => this._handle_form_changes(e, "name")}
                  type="text"
                  placeholder="Ingrese nuevo nombre"
                />
              </Form.Group>
            </Form>
            {this.state.message.length === 0 ? (
              <></>
            ) : (
              <Alert variant="secondary" style={{ padding: "7px" }}>
                {this.state.message}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              disabled={!this._check_form()}
              onClick={this._onclick_edit}
            >
              Editar componente {this.props.block.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_edit_root_component_function = (
  static_menu: static_menu,
  block: block,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_edit_root_component
      static_menu={static_menu}
      block={block}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
