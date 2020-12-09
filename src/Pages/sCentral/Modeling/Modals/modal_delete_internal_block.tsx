import React, { Component, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export interface modal_props {
  handle_close?: Function;
}

export interface modal_state {
  show: boolean;
  name: string;
}

let modal_id = "Modal_delete_block";

export class Modal_delete_internal_block extends Component<
  modal_props,
  modal_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: "---"
    };
  }
  handleClose = () => {
    // actualizo el estado local
    this.setState({ show: false });
    if (this.props.handle_close !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_close(modal_id, false);
    }
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  _set_status = (name) => { 
    this.setState({ name: name });
  }

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Eliminar bloque interno {this.state.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>Nombre del bloque:</Form.Label>
                <Form.Control type="text" placeholder="Ingrese nombre" />
                
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
