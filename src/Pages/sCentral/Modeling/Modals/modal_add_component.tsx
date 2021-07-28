import React, { Component, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { block, static_menu } from "../../../../components/SideBars/menu_type";
import { SCT_API_URL } from "../../Constantes";
import { leaf_block_form, root_component_form } from "../../types";
import { Sources } from "../Sources/Sources";

export interface menu_props {
  static_menu: static_menu;
  handle_close?: Function;
  handle_edited_root_block?: Function;
  handle_message?: Function;
}

export interface menu_state {
  show: boolean;
  form: root_component_form;
  message: string;
}

let modal_id = "modal_add_component";
export class Modal_add_component extends Component<
  menu_props,
  menu_state
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
  // crea un nuevo componente root dentro de un bloque:
  _onclick_create = () => {
    if (this._check_form()) {
      let path = `${SCT_API_URL}/component-root/block-root/${this.props.static_menu.parent_id}/block-leaf/${this.props.static_menu.public_id}`;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Creando componente interno" });
      // Creando el nuevo root block mediante la API
      fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
           this.handleEditedRootBlock(json.bloqueroot);
           this.handleClose();
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
            <Modal.Title>Añadir componente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>Nombre del componente:</Form.Label>
                <Form.Control
                  onChange={(e) => this._handle_form_changes(e, "name")}
                  type="text"
                  placeholder="Ingrese nuevo nombre"
                />
                
              </Form.Group>
              {this.state.message.length === 0 ? (
                <></>
              ) : (
                <Alert variant="secondary" style={{ padding: "7px" }}>
                  {this.state.message}
                </Alert>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={this._onclick_create}
              disabled={!this._check_form()}
            >
              Crear componente
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_add_component_function = (
  static_menu: static_menu,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_add_component
      static_menu={static_menu}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
