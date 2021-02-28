import React, { Component } from "react";
import "../../styles.css";
import { Tab, Tabs, Alert, Form, Card, Col, Button } from "react-bootstrap";
import { UTR, TAG } from "../../SRNode";
import DataTable from "react-data-table-component";
import ReactTooltip from "react-tooltip";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { SRM_API_URL } from "../../Constantes";

type Selected = {
  entidad_tipo: string;
  entidad_nombre: string;
  utr_nombre: string;
};

type SelectedID = {
  nodo: string;
  entidad: string;
  utr: string;
};

type SRModelingTAGState = {
  success: boolean;
  msg: string;
  loading: boolean;
  search: string;
  filter_tags: Array<TAG>;
  utr: UTR | undefined;
  tags_to_delete: Array<string>;
  tags_to_create: Array<TAG>;
};

type SRModelingTagsProps = {
  selected: Selected;
  selected_id: SelectedID;
};

const new_tag = {
  tag_name: "",
  filter_expression: "TE # ME",
  activado: true,
};
/* Este componente permite el manejo de tags */
class SRModelingTag extends Component<SRModelingTagsProps, SRModelingTAGState> {
  selected_utr: string;
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      msg: "",
      loading: false,
      search: "",
      filter_tags: [],
      utr: undefined,
      tags_to_delete: [],
      tags_to_create: [],
    };
    this.selected_utr = "";
  }

  componentDidMount = () => {
    this._get_utr();
  };

  componentDidUpdate() {
    // actualizando el controlador de selección de UTRs
    if (this.selected_utr !== this.props.selected_id.utr) {
      this._get_utr();
      this.selected_utr = this.props.selected_id.utr;
    }
  }

  _get_utr = async () => {
    this.setState({ utr: undefined });
    if (this.props.selected_id.utr === undefined) {
      return;
    }
    this.setState({
      loading: true,
      success: false,
      msg: "Cargando, espere por favor...",
      filter_tags: [],
    });
    let path =
      SRM_API_URL + "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;

    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({ utr: json.utr });
          this._filter_tags(this.state.search);
        }
        this.setState({ msg: json.msg, success: json.success, loading: false });
      })
      .catch(console.log);
  };

  _filter_tags = (e) => {
    let to_filter = undefined;
    if (e.target !== undefined) {
      to_filter = e.target.value.toLowerCase();
    } else {
      to_filter = String(e).toLowerCase();
    }
    this.setState({ search: to_filter });
    to_filter = to_filter.split("*").join(".*");

    let filter_tags = [];
    try {
      if (this.state.utr !== undefined) {
        this.state.utr.tags.forEach((tag) => {
          if (tag.tag_name.toLowerCase().match(to_filter) !== null) {
            filter_tags.push(tag);
          }
        });
        filter_tags = filter_tags.sort((a, b) =>
          a.tag_name > b.tag_name ? 1 : -1
        );
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false, filter_tags: filter_tags });
  };

  _edit_tags = () => {
    this.setState({ msg: "Guardando en base de datos", success: false });
    let path =
      SRM_API_URL + "/admin-sRemoto/tags/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;
    let edited_tags = [];
    for (var ix in this.state.filter_tags) {
      let tag = this.state.filter_tags[ix];
      if (tag["edited"]) {
        edited_tags.push(tag);
      }
    }
    if (edited_tags.length === 0) {
      this.setState({ msg: "Nada que guardar en base de datos" });
      return;
    }
    let to_send = { tags: edited_tags };
    fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.utr_nombre +
          json.msg;
        if (json.success) {
          let utr = this.state.utr;
          utr.tags = json.tags;
          this.setState({ utr: utr });
          this._filter_tags(this.state.search);
        }
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _render_tag_edit = (edit_columns) => {
    return (
      <div>
        <Card className="tab-container">
          <Form.Control
            type="text"
            value={this.state.search}
            onChange={this._filter_tags}
            placeholder="Tag a buscar"
          />
          {this.state.loading ? (
            <></>
          ) : (
            <DataTable
              pagination={true}
              columns={edit_columns}
              data={this.state.filter_tags}
              fixedHeader
              noHeader={true}
              compact={true}
            />
          )}
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-primary"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para guardar todos los cambios</div>"
              }
              data-html={true}
              onClick={this._edit_tags}
            >
              {"Editar TAGS en " + this.props.selected.utr_nombre}
            </Button>
            <ReactTooltip />
            <Button
              variant="outline-dark"
              style={{ float: "right", marginRight: "7px" }}
            >
              <CSVLink
                data={this.state.filter_tags}
                filename={this.props.selected.utr_nombre + ".csv"}
              >
                Descargar CSV
              </CSVLink>
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </div>
    );
  };

  

  _handleRowSelected = (selectedRowState) => {
    const { selectedCount, selectedRows } = selectedRowState;
    this.setState({ msg: selectedCount + " tags seleccionadas para eliminar" });
    let tags_to_delete = [];
    for (var ix in selectedRows) {
      tags_to_delete.push(selectedRows[ix].tag_name);
    }
    this.setState({ tags_to_delete: tags_to_delete });
  };

  _delete_tags = () => {
    let path =
      SRM_API_URL + "/admin-sRemoto/tags/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;

    if (this.state.tags_to_delete.length === 0) {
      this.setState({ msg: "No hay tags seleccionadas para eliminar" });
      return;
    }
    const confirm = window.confirm(
      "Seguro que desea eliminar las " +
        this.state.tags_to_delete.length +
        " tags seleccionadas?"
    );
    if (confirm) {
      this.setState({ msg: "Guardando en base de datos", success: false });
      let to_send = { tags: this.state.tags_to_delete };
      fetch(path, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(to_send),
      })
        .then((res) => res.json())
        .then((json) => {
          json.msg =
            (json.success
              ? "Operación exitosa en "
              : "Revise el detalle para ") +
            this.props.selected.utr_nombre +
            " " +
            json.msg;
          if (json.success) {
            let utr = this.state.utr;
            utr.tags = json.tags;
            this.setState({ utr: utr });
            this._filter_tags(this.state.search);
          }
          this.setState({ success: json.success, msg: json.msg });
        })
        .catch(console.log);
    }
  };

  _render_tag_delete = (delete_columns) => {
    return (
      <div>
        <Card className="tab-container">
          <Form.Control
            value={this.state.search}
            type="text"
            onChange={this._filter_tags}
            placeholder="Tag a buscar"
          />
          {this.state.loading ? (
            <></>
          ) : (
            <DataTable
              pagination={true}
              columns={delete_columns}
              data={this.state.filter_tags}
              fixedHeader
              noHeader={true}
              compact={true}
              selectableRows
              onSelectedRowsChange={this._handleRowSelected}
            />
          )}
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-danger"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para eliminar las tags seleccionadas</div>"
              }
              data-html={true}
              onClick={this._delete_tags}
            >
              {"Eliminar TAGS seleccionadas en " +
                this.props.selected.utr_nombre}
            </Button>
            <ReactTooltip />
            <Button
              variant="outline-dark"
              style={{ float: "right", marginRight: "7px" }}
            >
              <CSVLink
                data={this.state.filter_tags}
                filename={this.props.selected.utr_nombre + ".csv"}
              >
                Descargar CSV
              </CSVLink>
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </div>
    );
  };

  _add_tag = () => {
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create.push({ ...new_tag });
    this.setState({ tags_to_create: tags_to_create });
  };

  _handle_edit_add_tag = (e, ix, field) => {
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create[ix][field] = e.target.value;
    this.setState({ tags_to_create: tags_to_create });
  };

  _handle_check_add_tag = (e, ix, field) => {
    console.log(ix);
    let tags_to_create = this.state.tags_to_create;
    // trick in case the array is empty and it was pressed once
    if (this.state.tags_to_create.length === 0) {
      tags_to_create.push({ ...new_tag });
    }
    tags_to_create[ix][field] = !tags_to_create[ix][field];
    this.setState({ tags_to_create: tags_to_create });
  };

  _add_tags = () => {
    let path =
      SRM_API_URL + "/admin-sRemoto/tags/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad +
      "/" +
      this.props.selected_id.utr;

    if (this.state.tags_to_create.length === 0) {
      this.setState({ msg: "No hay tags a ingresar" });
      return;
    }

    this.setState({ msg: "Guardando en base de datos", success: false });
    let to_send = { tags: this.state.tags_to_create };
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.utr_nombre +
          " " +
          json.msg;
        if (json.success) {
          let utr = this.state.utr;
          utr.tags = json.tags;
          this.setState({ utr: utr });
          this._filter_tags(this.state.search);
        }
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _render_tag_add = () => {
    let tags_to_create = this.state.tags_to_create;
    if (tags_to_create.length === 0) {
      tags_to_create = [new_tag];
    }

    let tags = tags_to_create.map((tag, ix) => (
      <Form.Row key={ix} className="align-items-center">
        <Col sm={1}>
          <Form.Check
            checked={tag.activado}
            onChange={(e) => this._handle_check_add_tag(e, ix, "activado")}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Ingrese nombre de la Tag"
            value={tag.tag_name}
            onChange={(e) => this._handle_edit_add_tag(e, ix, "tag_name")}
          />
        </Col>
        <Col sm={4}>
          <Form.Control
            placeholder="Ingrese condición"
            value={tag.filter_expression}
            onChange={(e) =>
              this._handle_edit_add_tag(e, ix, "filter_expression")
            }
          />
        </Col>
      </Form.Row>
    ));

    return (
      <div>
        <Card className="tab-container">
          <br></br>
          <Button
            variant="outline-light"
            className="btn-add-tag"
            disabled={this.state.loading}
            onClick={this._add_tag}
          >
            <FontAwesomeIcon inverse icon={faPlusCircle} size="lg" />
          </Button>
          <br></br>
          <Form>
            <Form.Row>
              <Col sm={1}>
                <Form.Label>Activado</Form.Label>
              </Col>
              <Col>
                <Form.Label>Nombre de Tag</Form.Label>
              </Col>
              <Col sm={4}>
                <Form.Label>Condición de indisponibilidad</Form.Label>
              </Col>
            </Form.Row>
            {tags}
          </Form>
        </Card>
        <br></br>
        <Form.Row>
          <Form.Group id="createTags" as={Col}>
            <Button
              variant="outline-success"
              style={{ float: "right" }}
              data-tip={
                "<div>Presione aquí para crear las tags insertadas</div>"
              }
              data-html={true}
              onClick={this._add_tags}
            >
              {"Crear TAGS en " + this.props.selected.utr_nombre}
            </Button>
            <ReactTooltip />
            <Button
              variant="outline-dark"
              style={{ float: "right", marginRight: "7px" }}
            >
              <CSVLink
                data={this.state.tags_to_create}
                filename={this.props.selected.utr_nombre + ".csv"}
              >
                Descargar CSV
              </CSVLink>
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </div>
    );
  };

  render() {
    

    // Permite edición de boleano:
    let _input_checkbox = (row, field) => {
      return (
        <input
          type="checkbox"
          defaultChecked={row[field]}
          onChange={(e) =>
            _handle_change_in_table(e, row.tag_name, field, true)
          }
        ></input>
      );
    };

    // Permite edición en campos
    let _input_in_table = (row, field) => {
      return (
        <input
          className="table_input"
          defaultValue={row[field]}
          onBlur={(e) => _handle_change_in_table(e, row.tag_name, field)}
        ></input>
      );
    };

    // Actualizar cambios en tabla
    let _handle_change_in_table = (e, tag_name, field, isBoolean = false) => {
      if (
        this.state.filter_tags === undefined ||
        this.state.filter_tags.length === 0
      )
        return;
      let filter_tags = this.state.filter_tags;
      let tag;
      for (var ix in filter_tags) {
        tag = filter_tags[ix];
        if (tag.tag_name === tag_name) {
          if (filter_tags[ix]["edited"] === undefined) {
            filter_tags[ix]["edited"] = true;
            filter_tags[ix]["tag_name_original"] = tag_name;
          }
          if (isBoolean) {
            filter_tags[ix][field] = !filter_tags[ix][field];
          } else {
            filter_tags[ix][field] = e.target.value;
          }
          this.setState({
            filter_tags: filter_tags,
            msg:
              "Tag editada: " +
              filter_tags[ix]["tag_name_original"] +
              ". Pulse 'Editar' para guardar todos los cambios",
          });
          return;
        }
      }
    };

    /// Manejo de la Tabla
    // Definicion de headers para edición:
    const edit_columns = [
      {
        name: "Activado",
        width: "80px",
        //selector: "activado",
        cell: (row) => _input_checkbox(row, "activado"),
      },
      {
        name: "Nombre de tag",
        cell: (row) => _input_in_table(row, "tag_name"),
      },
      {
        name: "Condición de indisponibilidad",
        //selector: "filter_expression",
        cell: (row) => _input_in_table(row, "filter_expression"),
      },
    ];
    // Definición de headers para eliminación:
    const normal_columns = [
      {
        name: "Nombre de tag",
        selector: "tag_name",
      },
      {
        name: "Condición de indisponibilidad",
        selector: "filter_expression",
      },
    ];


    /// Fin de Manejo de Tabla

    return (
      <div className="tab-container">
        <Tabs
          defaultActiveKey="dt-editar-tags"
          id="un-tab-mod"
          transition={false}
        >
          <Tab eventKey="dt-create-tags" title="Crear tags">
            {this._render_tag_add()}
          </Tab>

          <Tab eventKey="dt-editar-tags" title="Editar tags">
            {this._render_tag_edit(edit_columns)}
          </Tab>

          <Tab eventKey="dt-delete-tags" title="Eliminar tags">
            {this._render_tag_delete(normal_columns)}
          </Tab>
        </Tabs>

        {this.state.msg.length === 0 ? (
          <></>
        ) : (
          <Alert variant={this.state.success ? "success" : "warning"}>
            {this.state.msg}
          </Alert>
        )}
      </div>
    );
  }
}
export default SRModelingTag;
