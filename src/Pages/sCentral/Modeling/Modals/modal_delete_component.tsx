import React, { Component } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { block, static_menu } from "../../../../components/SideBars/menu_type";
import { SCT_API_URL } from "../../Constantes";

export interface modal_props {
  static_menu: static_menu;
  block: block;
  handle_close?: Function;
  handle_edited_root_component?: Function;
  handle_message?: Function;
}

export interface modal_state {
  show: boolean;
  message: string;
}

let modal_id = "Modal_delete_component";

export class Modal_delete_component extends Component<
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
  handleEditedRootComponent = (bloqueroot) => {
    if (this.props.handle_edited_root_component !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_component(bloqueroot);
    }
  };

  // INTERNAL FUNCTIONS:
  // Elimina un componente root mediante: id del bloque root, id del bloque leaf e id del componente
  _onclick_delete = () => {
    console.log("datos a usar", this.props.block);
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.block.parent_id}/comp-leaf/${this.props.block.public_id}`;
    this.setState({ message: "Eliminando componente root interno" });
    // Creando el nuevo root block mediante la API
    fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.handleEditedRootComponent(json.component_root);
          this.handleClose();
        } else {
          this.setState({ message: json.msg });
          this.handleMessages(json.msg);
        }
      })
      .catch((error) => {
        console.log(error);
        let msg = "Ha fallado la conexión con la API de modelamiento (api-sct)";
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
  };

  render() {
    if (
      this.props.static_menu === undefined ||
      this.props.block === undefined
    ) {
      return <div>No hay configuraciones para este elemento</div>;
    }
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
            <Button variant="outline-danger" onClick={this._onclick_delete}>
              Eliminar {this.props.block.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_delete_component_function = (
  static_menu: static_menu,
  block: block,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_delete_component
      static_menu={static_menu}
      block={block}
      handle_close={handle_close}
      handle_edited_root_component={handle_changes_in_root}
    />
  );
};
