import React, { Component, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export interface add_menu_props {
  handle_close?: Function;
}

export interface add_menu_state {
  show: boolean;
}

let model_id = "Modal_add_component";
export class Modal_add_root_component extends Component<
  add_menu_props,
  add_menu_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }
  handleClose = () => {
    // actualizo el estado local
    this.setState({ show: false });
    if (this.props.handle_close !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_close(model_id, false);
    }
  };
  handleShow = () => {
    this.setState({ show: true });
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
            <Modal.Title>Empezar modelamiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>Nombre del componente interno:</Form.Label>
                <Form.Control type="text" placeholder="Ingrese nombre" />
                <Form.Text className="text-muted">
                  Se deben configurar aún más parámetros
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Crear y guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
