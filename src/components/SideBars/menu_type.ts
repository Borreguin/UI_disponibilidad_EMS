import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type menu = Array<menuBlock>;
  
export type menuBlock = {
    header: string,
    navData: Array<navData>
}

export type fatherMenus = Array<fatherMenu>

export type fatherMenu = {
    header: string,
    public_id: string,
    static_menu: static_menu
}

export type static_menu = {
    parent_id: string,
    name: string,
    public_id: string,
    icon?: IconDefinition,
    blocks?: Array<block>,
    object?: properties
}

export type properties = {
    parent_id?: string,
    public_id: string,
    document: string,
    name: string,
    position_x_y: Array<Number>,
    block_leafs?: Array<block_leaf>,
    operations: Array<operation>
    topology: Object,
}

export type leaf_component = {
    parent_id: string,
    public_id: string,
    calculation_type: string,
    document: string,
    name: string,
    position_x_y: Array<Number>
    leafs?: Array<block_leaf>
    object?: properties;
}

export type comp_root = {
    bloque: string,
    document: string,
    leafs: Array<leaf_component>,
    name: string,
    position_x_y: Array<Number>,
    public_id: string,
}

export type block_leaf = {
    parent_id: string,
    public_id: string,
    calculation_type: string,
    document: string,
    name: string,
    position_x_y: Array<Number>,
    topology?: Object, 
    comp_root: comp_root
}

export type operation = {
    public_id: string,
    name: string,
    type: string,
    operator_ids: Array<string>,
    position_x_y: Array<Number>,
    operation: operation,
}

export type block = {
    name: string,
    public_id: string,
    object?: properties
}

export type selectedBlock = {
    name: string,
    parent_id: string,
    public_id: string,
    object?: block_leaf
}

export type navData = {
    route: string,
    name: string,
    icon?: IconDefinition 
}

/* Example:

   const menu = [
        {
            header : "Test", navData : [
                { route: "/Pages/sRemoto", name: "Sistema Remoto" },
                { route: "/about", name: "Info" }
            ]
        },
        {
            header: "Test 2", navData : [
                { route: "/Pages/sRemoto", name: "Sistema Remoto" },
                { route: "/about", name: "Info" }
            ]
        }
    ]

*/