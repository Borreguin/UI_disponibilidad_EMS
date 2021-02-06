import * as React from 'react';
import { BlockNodeModel} from './BlockNodeModel';
import { DiagramEngine, PortModelAlignment } from '@projectstorm/react-diagrams';
import {SerialPort } from '../SerialPort'
import './BlockNodeStyle.css'
import { faTrash, faSave, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

export interface BlockWidgetProps {
	node: BlockNodeModel;
	engine: DiagramEngine;
	size?: number;
}


/**
 * @author Roberto Sánchez
 * this: es el contenido de un nodo, este tiene los atributos:
 * 	entidades: 	son los puertos que se van a implementar dentro del nodo
 * 	editado; 	indica si el nodo ha sido editado
 * 	node: 		contiene los datos del nodo (nombre, tipo, etc)
 * 	size: 		tamaño del nodo
 */
export class BlockWidget extends React.Component<BlockWidgetProps> {
	
	bck_node: BlockNodeModel;		// original node
	node: BlockNodeModel;  		// edited node
	state = {
		edited: false
	}
	
	constructor(props) { 
		super(props);
		this.state = {
			edited: false
		};
		this.node = _.cloneDeep(props.node);
		this.bck_node = _.cloneDeep(props.node)
	}

	_entityCallback = () => { 
	}

	_update_entidad_activado = (p: string) => { 
		/*this.node.data.entidades.forEach((entidad) => {
			if (entidad.entidad_nombre === p) { 
				entidad.activado = !entidad.activado;
			}
		});
		this.is_edited();*/
	}
	
	_eliminar_entidad = async (p: string) => { 
		/*console.log("inicio", this.node.data.entidades);
		const new_ents = []
		const confirm = window.confirm('Seguro que desea eliminar este elemento?');
		if (confirm) {
			this.node.data.entidades.forEach((entidad) => {
				if (entidad.entidad_nombre !== p) {
					new_ents.push(entidad);
				}
			});
			this.node.data.entidades = new_ents;
		}
		this.is_edited()*/
	}

	/*Generación de entidades */
	_generateEntityPorts = () => {
        /*return this.node.data.entidades.map((entidad)=> (
			<div key={entidad.entidad_nombre}>
				<div className="sr-port-block">
					<Button className="btn-delete" onClick={()=> this._eliminar_entidad(entidad.entidad_nombre)}>
							<FontAwesomeIcon icon={faTrash} size="sm"  /> 
					</Button>
					<span className="sr-port-label">
						{name_format(entidad.entidad_nombre)}
					</span>
					<div className="sr-port-connect">
						<span className="badge badge-warning">
							{entidad.n_tags} tags
						</span>
						<input type="checkbox" className="chk-entity"
							defaultChecked={entidad.activado}
							onChange={() => (this._update_entidad_activado(entidad.entidad_nombre))} >
						</input>
					</div>
				</div>
            </div>
        ));*/
	};
	
	generateNextPort = (port) => {
        return <div model={port} key={port.id}/>;
	};
	
	_addElement = () => {
       /* let newH = Object.assign([], this.props.node.data.entidades);
        let next_id = (newH.length>0)?newH.length as number+1:1;
		newH.push({
			entidad_nombre: "nueva entidad",
			entidad_tipo: "no definido",
			id: next_id,
			n_tags: 0,
			utrs: 0,
			activado: false 
		});
		console.log(newH, next_id)
        this.setState({
            entidades: newH
        });
		console.log("ADD next port", newH, this.props.node.data.entidades);
		this.props.node.addPort(new SerialPort(PortModelAlignment.TOP));
        // this.props.node.addNextPort("Nxt");*/
    };

	_updateNombre = (e) =>{ 
		/*this.node.data.nombre = e.target.value.trim();
		this.is_edited();
		this.props.node.setLocked(false);*/
	}
	_updateTipo = (e) => { 
		/*this.node.data.tipo = e.target.value.trim();
		this.is_edited();
		this.props.node.setLocked(false);*/
	}
	_update_activo = () => { 
		/*this.node.data.activado = !this.node.data.activado;
		this.is_edited()*/
	}

	is_edited = () => { 
		if (_.isEqual(this.bck_node, this.node)) {
			this.setState({ edited: false })
		} else { 
			this.setState({ edited: true })
		}	
	}

	hasChanged = (old_word: string, new_word: string) => { 
		if (old_word !== new_word && new_word.length > 3) {
			this.setState({ edited: true })
			return true;
		} else { 
			this.setState({ edited: false })
			return false;
		}
	}

	test = () => {
		console.log(this.bck_node)
	};

	render() {
		
		const { node } = this.props;
		return (
			<div className="node css-nlpftr" onClick={() => { this.props.node.setSelected(true)}} >
				<div className="sr-node">
					<div className="to-drag"/>
					<div className="sr-node-title" >
						<input
							defaultValue={node.data.name}
							type="text"
							onFocus={() => { this.props.node.setLocked(true) }}
							onChange={this._updateNombre}
							onBlur={() => { this.props.node.setLocked(false) }}
							className="sr-input"
						/>
						<Button variant="outline-dark" className={this.state.edited ?
							"btn-save btn-active" : "btn-save btn-disabled"}>
							<FontAwesomeIcon icon={faSave} inverse size="sm"  /> 
						</Button>
					</div>
					<input
						defaultValue={node.data.name}
						type="text"
						onFocus={() => { this.props.node.setLocked(true) }}
						onChange={this._updateTipo}
						onBlur={() => { this.props.node.setLocked(false) }}
						className="sr-node-subtitle"
					/>
					
					<FontAwesomeIcon icon={this.node.data.name ? faToggleOn : faToggleOff}
						inverse size="2x"
						className={this.node.data.name ? "icon-on" : "icon-off"}
						onClick={this._update_activo}
					/> 
				
					{this._generateEntityPorts()}
					<div className="widget-add"><button onClick={this._addElement}>+</button></div>
				</div>
			</div>
		);
	}
}

function name_format(name: string) {
	const n = 9;
	if (name.length > n) {
		name = name.toUpperCase().substring(0, n) + "."
	} else { 
		name = name.toUpperCase() + ".".repeat(n-name.length) + "."
	}
	return name
 }
