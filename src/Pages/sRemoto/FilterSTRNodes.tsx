import React, { Component } from "react";
import { Form, Col, Spinner } from "react-bootstrap";
import { Node } from "../../components/Cards/SRCard/SRCardModel";
import { SRM_API_URL } from "./Constantes";

export interface SRConsigProps {
  onChange: Function;
}

export interface SRConsigState {
  loading: boolean;
  nodes: Array<Node>;
  options: Object;
}

class FilterSTRNodes extends Component<SRConsigProps, SRConsigState> {
  selected: {};
  selected_id: {};
  utrs: any[];
  url: string;
  entidades: any[];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      nodes: [],
      options: {},
    };
    this.selected = {};
    this.entidades = [];
    this.utrs = [];
    this.url = "";
  }

  _handle_filter_change = () => {
    let selected_id = {};
    selected_id["nodo"] = undefined;
    selected_id["entidad"] = undefined;
    selected_id["utr"] = undefined;

    for (var idx in this.state.nodes) {
      let node = this.state.nodes[idx];
      if (
        node.tipo === this.selected["nodo_tipo"] &&
        node.nombre === this.selected["nodo_nombre"]
      ) {
        selected_id["nodo"] = node.id_node;
        for (var idy in node.entidades) {
          let entidad = node.entidades[idy];
          if (
            entidad.entidad_nombre === this.selected["entidad_nombre"] &&
            entidad.entidad_tipo === this.selected["entidad_tipo"]
          ) {
            selected_id["entidad"] = entidad.id_entidad;
          }
        }
      }
    }
    for (var idz in this.utrs) {
      let utr = this.utrs[idz];
      if (
        utr.utr_tipo === this.selected["utr_tipo"] &&
        utr.utr_nombre === this.selected["utr_nombre"]
      ) {
        selected_id["utr"] = utr.utr_code;
      }
    }
    this.props.onChange(this.selected, selected_id);
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    let path = SRM_API_URL + "/admin-sRemoto/nodos/";
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          // si existe errores:
          this.setState({ nodes: [], loading: false });
        } else {
          // si los nodos están ok:
          let nodes = json.nodos;
          nodes.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
          this.setState({ nodes: nodes });
          this.setState({ loading: false });
        }
        this._node_types();
        this._update_node();
        this._handle_filter_change();
      })
      .catch(console.log);
  };

  _filter_options = (
    array: any[],
    field: string,
    if_field = undefined,
    if_value = undefined
  ) => {
    let options = [];
    let check = [];
    array.forEach((item, ix) => {
      if (!check.includes(item[field])) {
        if (if_field === undefined || if_value === undefined) {
          options.push(<option key={ix}>{item[field]}</option>);
          check.push(item[field]);
        } else if (item[if_field] === if_value) {
          options.push(<option key={ix}>{item[field]}</option>);
          check.push(item[field]);
        }
      }
    });
    return options;
  };

  _node_types = () => {
    let options = this.state.options;
    let selected = this.selected;
    if (this.state.nodes.length > 0) {
      if (selected["nodo_tipo"] === undefined) {
        selected["nodo_tipo"] = this.state.nodes[0].tipo;
        this.selected = selected;
      }
      options["nodo_tipo"] = this._filter_options(this.state.nodes, "tipo");
    } else {
      selected["nodo_tipo"] = undefined;
      options["nodo_tipo"] = [<option>No existen nodos a seleccionar</option>];
      options["entidad_tipo"] = [
        <option>No existen entidades a seleccionar</option>,
      ];
      options["utr_tipo"] = [<option>No existen utrs a seleccionar</option>];
      this._utr_names();
      return;
    }
    this.setState({ options: options });
    this._node_names();
  };

  _node_names = () => {
    if (this.state.nodes.length === 0) {
      this._utr_names();
      return;
    }
    let options = this.state.options;
    options["nodo_nombre"] = this._filter_options(
      this.state.nodes,
      "nombre",
      "tipo",
      this.selected["nodo_tipo"]
    );
    this.setState({ options: options });

    if (options["nodo_nombre"].length > 0) {
      this.selected["nodo_nombre"] = options["nodo_nombre"][0].props.children;
      this._update_node();
    } else {
      this.selected["nodo_nombre"] = undefined;
    }
    this._entity_types();
  };

  _entity_types = () => {
    let options = this.state.options;
    this.selected["entidad_tipo"] = undefined;
    this.selected["entidad_nombre"] = undefined;

    if (this.state.nodes.length === 0) {
      this.utrs = [];
      this._utr_type();
      return;
    }

    let nodes = this.state.nodes;
    for (var idx in nodes) {
      let node = nodes[idx];
      if (
        node.tipo === this.selected["nodo_tipo"] &&
        node.nombre === this.selected["nodo_nombre"]
      ) {
        // filtrando por tipo y nombre, entidad tipo:
        options["entidad_tipo"] = this._filter_options(
          node.entidades,
          "entidad_tipo"
        );
        // filtrando por tipo y nombre, entidad nombre:
        options["entidad_nombre"] = this._filter_options(
          node.entidades,
          "entidad_nombre"
        );
        if (options["entidad_tipo"].length > 0) {
          this.selected["entidad_tipo"] =
            options["entidad_tipo"][0].props.children;
          this.selected["entidad_nombre"] =
            options["entidad_nombre"][0].props.children;
        } else {
          options["entidad_tipo"] = [
            <option key={0}>No existen entidades a seleccionar </option>,
          ];
          options["entidad_nombre"] = [<option key={0}> </option>];
          this.utrs = [];
          this._utr_type();
          return;
        }
      }
    }
    this.setState({ options: options });
    this._entity_names();
  };

  _entity_names = () => {
    let options = this.state.options;
    if (this.state.nodes.length === 0) {
      this.selected["nodo_nombre"] = undefined;
      this._update_node();
      return;
    }
    
    if (
      this.selected["entidad_nombre"] === undefined &&
      this.state.nodes.length > 0
    ) {
      let entidades = this.state.nodes[0].entidades;
      options["entidad_nombre"] = this._filter_options(
        entidades,
        "entidad_nombre"
      );
      if (entidades.length === 0) {
        this.selected["entidad_nombre"] = undefined;
        this.selected["entidad_tipo"] = undefined;
      }
      this.setState({ options: options });
      this._update_node();
      return;
    }
    for (var idx in this.state.nodes) {
      let node = this.state.nodes[idx];
      if (
        node.tipo === this.selected["nodo_tipo"] &&
        node.nombre === this.selected["nodo_nombre"]
      ) {
        options["entidad_nombre"] = this._filter_options(
          node.entidades,
          "entidad_nombre",
          "entidad_tipo",
          this.selected["entidad_tipo"]
        );
        if (options["entidad_nombre"].length > 0) {
          this.selected["entidad_nombre"] =
            options["entidad_nombre"][0].props.children;
        } else {
          this.selected["entidad_nombre"] = undefined;
        }
      }
    }
    this.setState({ options: options });
    this._update_node();
  };

  _utr_type = () => {
    let options = this.state.options;
    if (this.utrs.length === 0) {
      options["utr_tipo"] = [
        <option key={1}>No hay UTRs a seleccionar</option>,
      ];
      options["utr_nombre"] = [];
      this.selected["utr_tipo"] = undefined;
      this.selected["utr_nombre"] = undefined;
    } else {
      this.setState({ options: options });
      options["utr_tipo"] = this._filter_options(this.utrs, "utr_tipo");
      if (this.selected["utr_tipo"] === undefined) {
        this.selected["utr_tipo"] = options["utr_tipo"][0].props.children;
      }
      if (options["utr_tipo"].length === 0) {
        this.selected["utr_tipo"] = undefined;
      }
    }
    this.setState({ options: options });
    this._utr_names();
  };

  _utr_names = () => {
    let options = this.state.options;
    this.utrs.sort((a, b)=>(a.utr_nombre > b.utr_nombre)? 1 : -1)
    options["utr_nombre"] = this._filter_options(
      this.utrs,
      "utr_nombre",
      "utr_tipo",
      this.selected["utr_tipo"]
    );
    if (options["utr_nombre"].length > 0) {
      this.selected["utr_nombre"] = options["utr_nombre"][0].props.children;
    } else {
      this.selected["utr_nombre"] = undefined;
    }
    this.setState({ options: options });
    this._handle_filter_change();
  };

  _update_node = async () => {
    let path =
      SRM_API_URL + "/admin-sRemoto/nodo/" +
      this.selected["nodo_tipo"] +
      "/" +
      this.selected["nodo_nombre"];
    let entidades = this.entidades;
    let options = this.state.options;
    options["utr_tipo"] = [<option key={0}>Cargando...</option>];
    options["utr_nombre"] = [<option key={0}>Cargando...</option>];
    this.selected["utr_tipo"] = undefined;
    this.selected["utr_nombre"] = undefined;
    this.setState({ options: options });

    if (this.url !== path) {
      await fetch(path)
        .then((res) => res.json())
        .then((nodo) => {
          if (nodo !== null) {
            entidades = nodo.entidades;
            this.entidades = entidades;
            this.url = path;
          }
        })
        .catch(console.log);
    }
    for (var idx in entidades) {
      let entidad = entidades[idx];
      if (
        entidad.entidad_tipo === this.selected["entidad_tipo"] &&
        entidad.entidad_nombre === this.selected["entidad_nombre"]
      ) {
        this.utrs = entidad.utrs;
        this._utr_type();
      }
    }
  };

  _handle_change = (e, name) => {
    if (this.state.nodes.length === 0) return;
    let { value } = e.target;
    this.selected[name] = value;

    switch (name) {
      case "nodo_tipo":
        this._node_names();
        break;
      case "nodo_nombre":
        this._entity_types();
        break;
      case "entidad_tipo":
        this._entity_names();
        break;
      case "entidad_nombre":
        this._update_node();
        break;
      case "utr_tipo":
        this._utr_names();
        break;
    }
    this._handle_filter_change();
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>
            <br></br>
            <Spinner animation="border" role="status" size="sm" />
            <span> Espere por favor, cargando ...</span>
          </div>
        ) : (
          <Form className="tab-container">
            <Form.Label className="cons-label">Selecione Nodo</Form.Label>
            <Form.Row>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "nodo_tipo")}
                >
                  {this.state.options["nodo_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["nodo_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "nodo_nombre")}
                >
                  {this.state.options["nodo_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["nodo_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Label className="cons-label">Selecione Entidad</Form.Label>
            <Form.Row>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "entidad_tipo")}
                >
                  {this.state.options["entidad_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["entidad_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "entidad_nombre")}
                >
                  {this.state.options["entidad_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["entidad_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Label className="cons-label">Selecione UTR</Form.Label>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "utr_tipo")}
                >
                  {this.state.options["utr_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["utr_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => this._handle_change(e, "utr_nombre")}
                >
                  {this.state.options["utr_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["utr_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </div>
    );
  }
}

export default FilterSTRNodes;
