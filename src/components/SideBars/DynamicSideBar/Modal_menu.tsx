import React, { Component } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { block, static_menu } from "../menu_type";

export interface modal_props {
  static_menu: static_menu;
  block: block;
  handle_close?: Function;
  handle_edited_root_block?: Function;
  handle_message?: Function;
}

export interface modal_state {
  show: boolean;
  message: string;
}

let modal_id = "Modal_delete_root_component";

export class Modal_Menu extends Component<
  modal_props,
  modal_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
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
  handleEditedRootBloack = (bloqueroot) => {
    if (this.props.handle_edited_root_block !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_block(bloqueroot);
    }
  };

  // INTERNAL FUNCTIONS:
  _onclick_submit = () => {
    console.log("Ready for doing things here");
  };

  _handle_form_changes = (e, field) => {};

  _check_form = () => {
    return false;
  };

  _render_modal = () => {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Eliminación de componente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>
                  Desea eliminar el componente: {this.props.block.name}?{" "}
                </Form.Label>
                <Form.Text>
                  Esta acción es permanente y se eliminará todo el contenido
                  interno de este componente, esto incluye todos los componentes
                  internos modelados.
                </Form.Text>
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
            <Button variant="outline-danger" onClick={this._onclick_submit}>
              Eliminar {this.props.block.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  render() {
    if (
      this.props.static_menu === undefined ||
      this.props.block === undefined
    ) {
      return <div>No hay configuraciones para este elemento</div>;
    } else {
      this._render_modal();
    }
  }
}

export const modal_menu_function = (
  static_menu: static_menu,
  block: block,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_Menu
      static_menu={static_menu}
      block={block}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
